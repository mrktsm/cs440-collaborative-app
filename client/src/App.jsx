import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetch('/api/counter')
      .then((response) => response.json())
      .then((data) => setCount(data.count))
  }, [])

  async function handleClick() {
    const response = await fetch('/api/counter', { method: 'POST' })
    const data = await response.json()
    setCount(data.count)
  }

  return (
    <main>
      <h1>Click Counter</h1>
      <p>Clicks: {count}</p>
      <button type="button" onClick={handleClick}>Click me</button>
    </main>
  )
}

export default App
