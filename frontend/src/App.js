import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/health")
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(err => setStatus("Backend not reachable"));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Workflow Automation System</h1>
      <p>{status}</p>
    </div>
  );
}

export default App;
