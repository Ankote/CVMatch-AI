import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


function MatchCv() {
  const navigate = useNavigate();
  const [cvFile, setCvFile] = useState(null);
  const [jobText, setJobText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('my_token');

  // ✅ Optional: Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem('my_token');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    setError(null);

    const formData = new FormData();
    formData.append('pdf', cvFile);
    formData.append('job_details', jobText);

    try {
      const res = await fetch('http://localhost:8000/gemini-verification/', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data = await res.json();
      setResult(data.result || 'No result');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>CV Matcher</h1>
        <button onClick={handleLogout} style={{ backgroundColor: '#dc3545' }}>Logout</button>
      </div>

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
          Error: {error}
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
          <strong>Match Result:</strong><br />
          {result.score && <p><strong>Score:</strong> {result.score}</p>}
          {!result.score && !result.reason && <p>{result}</p>}
          {result.reason && <p><strong>Reason:</strong> {result.reason}</p>}
        </div>
      )}
    </div>
  );
}

export default MatchCv;
