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
    fetch("http://127.0.0.1:5000/api/health")
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(err => setStatus("Backend not reachable"));

    fetchUsers();
  }, []);

  // Add user
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setMessage(data.error);
        else {
          setMessage("User added successfully!");
          setName(""); setEmail("");
          fetchUsers();
        }
      })
      .catch(err => setMessage("Something went wrong"));
  };

  // Update user
  const handleUpdate = (userId) => {
    const newName = prompt("Enter new name:");
    const newEmail = prompt("Enter new email:");
    fetch(`http://127.0.0.1:5000/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, email: newEmail }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setMessage(data.error);
        else {
          setMessage("User updated!");
          fetchUsers();
        }
      });
  };

  // Delete user
  const handleDelete = (userId) => {
    if (!window.confirm("Are you sure?")) return;
    fetch(`http://127.0.0.1:5000/api/users/${userId}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        fetchUsers();
      });
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Workflow Automation System</h1>
      <p>{status}</p>

      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required /><br /><br />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /><br /><br />
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
              {user.name} ({user.email}){" "}
              <button onClick={() => handleUpdate(user.id)}>Update</button>{" "}
              <button onClick={() => handleDelete(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
