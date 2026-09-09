import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [songs, setSongs] = useState([])
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')

  useEffect(() => {
    fetch('/api/songs')
      .then((response) => response.json())
      .then(setSongs)
  }, [])

  async function addSong(event) {
    event.preventDefault()

    const response = await fetch('/api/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, artist }),
    })
    const song = await response.json()

    setSongs((current) => [...current, song])
    setTitle('')
    setArtist('')
  }

  async function deleteSong(id) {
    await fetch(`/api/songs/${id}`, { method: 'DELETE' })
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
            <button type="submit">Add</button>
          </form>
        </li>
      </ul>
    </main>
  )
}

export default App
