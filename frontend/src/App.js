import { useState } from 'react';
import './App.css';

function App() {
  const [cvFile, setCvFile] = useState(null);
  const [jobText, setJobText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    if (!cvFile || !jobText.trim()) {
      setError("Both CV and job description are required.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('pdf', cvFile);
    formData.append('job_details', jobText);

    try {
      const res = await fetch('http://localhost:8000/api/verifier_gemini/', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data = await res.json();
      setResult(data); // store full result: { score, reason }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>CV Matcher</h1>

      <form onSubmit={handleSubmit}>
        <label>Upload CV (.pdf or .txt)</label>
        <input type="file" onChange={(e) => setCvFile(e.target.files[0])} />

        <label>Paste Job Description</label>
        <textarea
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
        />

        <button type="submit" disabled={loading || !cvFile || !jobText}>
          {loading ? 'Matching...' : 'Match'}
        </button>
      </form>

      {loading && <div className="loading">Processing your CV... please wait ⏳</div>}

      {error && (
        <div className="error-box">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div
          className={`result-box ${
            result.score && parseFloat(result.score) >= 50
              ? 'green-box'
              : 'red-box'
          }`}
        >
          <strong>Match Result:</strong>
          <p><strong>Score:</strong> {result.score}</p>
          <p><strong>Reason:</strong> {result.reason}</p>
        </div>
      )}
    </div>
  );
}

export default App;
