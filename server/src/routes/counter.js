import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.get('/', async (_request, response) => {
  const [[counter]] = await pool.execute(
    'SELECT value AS count FROM counter WHERE id = 1',
  )
  response.json(counter)
})

router.post('/', async (_request, response) => {
  await pool.execute('UPDATE counter SET value = value + 1 WHERE id = 1')
  const [[counter]] = await pool.execute(
    'SELECT value AS count FROM counter WHERE id = 1',
  )
  response.json(counter)
})

export default router
