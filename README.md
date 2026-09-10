# CS 440 Song List

A small full-stack app where people can add songs to a shared list.

## Stack

- React and Vite
- Node.js and Express
- MySQL
- Docker Compose

## Run

1. Start Docker Desktop.
2. Run `docker compose up -d --build`.
3. Run `docker compose run --rm server npm run migrate` to apply both members' migrations.
4. Open [http://localhost:8080](http://localhost:8080).

Stop the app with `docker compose down`.
