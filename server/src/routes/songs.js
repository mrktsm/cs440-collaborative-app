import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.get('/', async (_request, response) => {
  const [songs] = await pool.execute(
    'SELECT id, title, artist FROM songs ORDER BY id',
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

  if (!title) {
    return response.status(400).json({ message: 'Song title is required' })
  }

  const [result] = await pool.execute(
    'INSERT INTO songs (title, artist) VALUES (?, ?)',
    [title, artist || null],
  )

  return response.status(201).json({ id: result.insertId, title, artist })
})

router.delete('/:id', async (request, response) => {
  await pool.execute('DELETE FROM songs WHERE id = ?', [request.params.id])
  response.status(204).end()
})

export default router
