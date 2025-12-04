import React, { useState } from 'react'
import './App.css'

const App = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add API call here
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">🔗 URL Shortener</h1>
        <p className="subtitle">Convert long URLs into short, shareable links</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor='url' className="label">Enter Your URL:</label>
            <input
              type="url"
              id="url"
              placeholder='https://example.com/very/long/url'
              name='url'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="input"
            />
          </div>
          <button type="submit" className="button">Generate Short URL</button>
        </form>

        {shortUrl && (
          <div className="result">
            <p className="result-label">Your Short URL:</p>
            <div className="result-box">
              <span className="result-text">{shortUrl}</span>
              <button className="copy-btn" onClick={() => navigator.clipboard.writeText(shortUrl)}>
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
