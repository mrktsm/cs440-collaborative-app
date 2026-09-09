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
  const [duration, setDuration] = useState('')
  const [playlist, setPlaylist] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [genre, setGenre] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    fetch(`${API_BASE}/api/songs`)
      .then((response) => response.json())
      .then(setSongs)
  }, [])

  async function addSong(event) {
    event.preventDefault()

    const toPlaylist = event.nativeEvent.submitter?.value === 'playlist'
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch(`${API_BASE}${toPlaylist ? '/api/playlist-entries' : '/api/songs'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, artist, genre, note, duration_seconds: Number(duration), playlist_name: playlist }),
      })
      const song = await response.json()
      if (!response.ok) throw new Error(song.message || 'Could not add song')
      setSongs((current) => [...current, song])
      setMessage(toPlaylist ? `Added to ${playlist.trim()}.` : 'Song added.')
      setTitle('')
      setArtist('')
      setGenre('')
      setNote('')
      setDuration('')
      setPlaylist('')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setSaving(false)
    }
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
              maxLength={60}
            />
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Note (required for Add)"
            />
            <input value={duration} onChange={(event) => setDuration(event.target.value)}
              type="number" min="1" max="4294967295" step="1" placeholder="Seconds" aria-label="Duration in seconds" />
            <input value={playlist} onChange={(event) => setPlaylist(event.target.value)}
              maxLength={120} placeholder="Playlist name" aria-label="Playlist name" />
            <button type="submit" disabled={saving}>Add</button>
            <button type="submit" value="playlist" disabled={saving}>Add to playlist</button>
          </form>
        </li>
      </ul>
      <p role="status">{message}</p>
    </main>
  )
}

export default App
