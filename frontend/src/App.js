import { useState } from 'react';
import './App.css';

function App() {
  const [cvFile, setCvFile] = useState(null);
  const [jobText, setJobText] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('pdf', cvFile);
    formData.append('job_details', jobText);

    const res = await fetch('http://localhost:8000/api/match/', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    // console.log(data.result.score)
    setResult(data.result || 'No result');
  };

  return (
    <div className="App">
      <h1>CV Matcher</h1>
      <form onSubmit={handleSubmit}>
        <label>Upload CV:</label>
        <input type="file" onChange={e => setCvFile(e.target.files[0])} />
        <br />
        <label>Paste Job Description:</label>
        <textarea value={jobText} onChange={e => setJobText(e.target.value)} />
        <br />
        <button type="submit">Match</button>
      </form>
      {result && (
        <div>
          <h2>Result</h2>
          {/* <p> score : {result.score}</p>
          <p> Reason : {result.reason}</p> */}
        </div>
      )}
    </div>
  );
}

export default App;
