import cors from 'cors'
import express from 'express'
import songRouter from './routes/songs.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '10kb' }))

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'song-list-api' })
})

app.use('/api/songs', songRouter)

app.use((request, response) => {
  response.status(404).json({ message: `Route not found: ${request.path}` })
})

app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(500).json({ message: 'An unexpected server error occurred' })
})

export default app
