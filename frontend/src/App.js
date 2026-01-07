import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("Loading...");
  const [users, setUsers] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Fetch users from backend
  const fetchUsers = () => {
    fetch("http://127.0.0.1:5000/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    // Health check
    fetch("http://127.0.0.1:5000/api/health")
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(err => setStatus("Backend not reachable"));

    // Load users
    fetchUsers();
  }, []);

  // 🔥 Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setMessage("User added successfully!");
          setName("");
          setEmail("");
          fetchUsers(); // Refresh user list
        }
      })
      .catch(err => {
        console.error("Error:", err);
        setMessage("Something went wrong");
      });
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Workflow Automation System</h1>
      <p>{status}</p>

      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Add User</button>
      </form>

      {message && <p>{message}</p>}

      <h2>Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
