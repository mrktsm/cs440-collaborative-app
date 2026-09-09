import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.get('/', async (_request, response) => {
  const [songs] = await pool.execute(
    `SELECT s.id, s.title, s.artist, s.album, s.genre, sn.note
     FROM songs s
     LEFT JOIN song_notes sn ON sn.song_id = s.id
     ORDER BY s.id`,
  )
  response.json(songs)
})

router.post('/', async (request, response) => {
  const title = typeof request.body.title === 'string'
    ? request.body.title.trim()
    : ''
  const artist = typeof request.body.artist === 'string'
    ? request.body.artist.trim()
    : ''
  const album = typeof request.body.album === 'string'
    ? request.body.album.trim()
    : ''
  const genre = typeof request.body.genre === 'string'
    ? request.body.genre.trim()
    : ''
  // Kris's addition: a short note stored in its own table (song_notes),
  // linked back to the song that was just created.
  const note = typeof request.body.note === 'string'
    ? request.body.note.trim()
    : ''

  if (!title) {
    return response.status(400).json({ message: 'Song title is required' })
  }

  if (!artist) {
    return response.status(400).json({ message: 'Artist is required' })
  }

  if (!note) {
    return response.status(400).json({ message: 'Note is required' })
  }

  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    // Main table
    const [songResult] = await connection.execute(
      'INSERT INTO songs (title, artist, album, genre) VALUES (?, ?, ?, ?)',
      [title, artist, album || null, genre || null],
    )

    // Kris's table
    await connection.execute(
      'INSERT INTO song_notes (song_id, note) VALUES (?, ?)',
      [songResult.insertId, note],
    )

    // Soikat's table: keep a row for the artist from the form
    await connection.execute(
      'INSERT INTO artists (name, bio) VALUES (?, ?)',
      [artist, album ? `Album: ${album}` : null],
    )

    await connection.commit()

    return response.status(201).json({
      id: songResult.insertId,
      title,
      artist,
      album: album || null,
      genre: genre || null,
      note,
    })
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
})

router.delete('/:id', async (request, response) => {
  await pool.execute('DELETE FROM songs WHERE id = ?', [request.params.id])
  response.status(204).end()
})

export default router