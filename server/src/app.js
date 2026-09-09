import cors from 'cors'
import express from 'express'
import counterRouter from './routes/counter.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '10kb' }))

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'click-counter-api' })
})

app.use('/api/counter', counterRouter)

app.use((request, response) => {
  response.status(404).json({ message: `Route not found: ${request.path}` })
})

app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(500).json({ message: 'An unexpected server error occurred' })
})

export default app
