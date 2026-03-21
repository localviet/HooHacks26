import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const {message, setMessage} = useState("");

  useEffect(() => {
    fetch("/api/test")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className='p-2'>
      <h1>les friggin do this</h1>
      <p>Message: {message}</p>
    </div>
  )
}

export default App
