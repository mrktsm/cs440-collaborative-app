import { useEffect, useState } from 'react'
import './App.css'

// In local dev this is empty and requests go through the Vite proxy
// (see vite.config.js) to http://localhost:3000. When the frontend is
// deployed separately (e.g. Vercel/Netlify) from the backend (e.g.
// Railway), set VITE_API_URL to the deployed backend's base URL.
const API_BASE = import.meta.env.VITE_API_URL ?? ''

function App() {
  const [songs, setSongs] = useState([])
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [genre, setGenre] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    fetch(`${API_BASE}/api/songs`)
      .then((response) => response.json())
      .then(setSongs)
  }, [])

  async function addSong(event) {
    event.preventDefault()

    const response = await fetch(`${API_BASE}/api/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, artist, genre, note }),
    })
    const song = await response.json()

    setSongs((current) => [...current, song])
    setTitle('')
    setArtist('')
    setGenre('')
    setNote('')
  }

  async function deleteSong(id) {
    await fetch(`${API_BASE}/api/songs/${id}`, { method: 'DELETE' })
    setSongs((current) => current.filter((song) => song.id !== id))
  }

  return (
    <main>
      <h1>Song List</h1>

      <ul>
        {songs.map((song) => (
          <li className="song-row" key={song.id}>
            <span>
              <strong>{song.title}</strong>
              {song.artist && ` — ${song.artist}`}
              {song.genre && ` (${song.genre})`}
              {song.note && <em className="song-note"> — “{song.note}”</em>}
            </span>
            <button
              className="delete-button"
              type="button"
              onClick={() => deleteSong(song.id)}
              aria-label={`Delete ${song.title}`}
            >
              ×
            </button>
          </li>
        ))}

        <li>
          <form onSubmit={addSong}>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Song title"
              required
            />
            <input
              value={artist}
              onChange={(event) => setArtist(event.target.value)}
              placeholder="Artist"
            />
            <input
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
              placeholder="Genre"
            />
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Note"
              required
            />
            <button type="submit">Add</button>
          </form>
        </li>
      </ul>
    </main>
  )
}

export default App