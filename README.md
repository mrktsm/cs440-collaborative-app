# CS 440 Click Counter

A minimal full-stack app with one button. Clicking the button updates a counter stored in MySQL.

## Stack

- React and Vite
- Node.js and Express
- MySQL
- Docker Compose

## Run

1. Install and start Docker Desktop.
2. Run `docker compose up --build`.
3. Open [http://localhost:8080](http://localhost:8080).

Stop the app with `docker compose down`.

## API

- `GET /api/counter` returns the current count.
- `POST /api/counter` increments and returns the count.
- `GET /api/health` checks that the Express server is running.
