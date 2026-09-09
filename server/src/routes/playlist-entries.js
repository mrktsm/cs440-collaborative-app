import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.post('/', async (request, response) => {
  const body = request.body ?? {}
  const title = typeof body.title === 'string' ? body.title.trim() : ''
  const artist = typeof body.artist === 'string' ? body.artist.trim() : ''
  const playlistName = typeof body.playlist_name === 'string' ? body.playlist_name.trim() : ''
  const duration = body.duration_seconds

  if (!title || title.length > 120 || artist.length > 120 ||
      !playlistName || playlistName.length > 120 ||
      !Number.isInteger(duration) || duration < 1 || duration > 4294967295) {
    return response.status(400).json({
      message: 'Enter a title, playlist name, and positive whole-number duration. Text fields must be at most 120 characters.',
    })
  }

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const [song] = await connection.execute(
      'INSERT INTO songs (title, artist, duration_seconds) VALUES (?, ?, ?)',
      [title, artist || null, duration],
    )
    await connection.execute(
      'INSERT INTO sunny_playlist_entries (song_id, playlist_name) VALUES (?, ?)',
      [song.insertId, playlistName],
    )
    await connection.commit()
    response.status(201).json({
      id: song.insertId,
      playlist_name: playlistName,
      title,
      artist: artist || null,
      duration_seconds: duration,
    })
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
})

export default router
