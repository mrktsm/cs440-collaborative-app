import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [songs, setSongs] = useState([])
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [duration, setDuration] = useState('')
  const [playlist, setPlaylist] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/songs')
      .then((response) => response.json())
      .then(setSongs)
  }, [])

  async function addSong(event) {
    event.preventDefault()

    const toPlaylist = event.nativeEvent.submitter?.value === 'playlist'
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch(toPlaylist ? '/api/playlist-entries' : '/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, artist, duration_seconds: Number(duration), playlist_name: playlist }),
      })
      const song = await response.json()
      if (!response.ok) throw new Error(song.message || 'Could not add song')
      setSongs((current) => [...current, song])
      setMessage(toPlaylist ? `Added to ${playlist.trim()}.` : 'Song added.')
      setTitle('')
      setArtist('')
      setDuration('')
      setPlaylist('')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setSaving(false)
    }
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
