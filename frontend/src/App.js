import { useEffect, useState } from "react";
import UserList from "./components/UserList";
import WorkflowList from "./components/WorkflowList";

function App() {
  const [status, setStatus] = useState("Loading...");
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [workflows, setWorkflows] = useState([]);
  const [workflowTitle, setWorkflowTitle] = useState("");

  // Fetch users
  const fetchUsers = () => {
    fetch("http://127.0.0.1:5000/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  };

  // Fetch workflows for selected user
  const fetchWorkflows = (userId) => {
    fetch(`http://127.0.0.1:5000/api/users/${userId}/workflows`)
      .then(res => res.json())
      .then(data => setWorkflows(data));
  };

  // Add workflow
  const addWorkflow = () => {
    if (!workflowTitle) return;
    fetch(`http://127.0.0.1:5000/api/users/${selectedUser}/workflows`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: workflowTitle }),
    })
      .then(res => res.json())
      .then(() => {
        setWorkflowTitle("");
        fetchWorkflows(selectedUser);
      });
  };

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
      .catch(() => setMessage("Something went wrong"));
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
        else fetchUsers();
      });
  };

  // Delete user
  const handleDelete = (userId) => {
    if (!window.confirm("Are you sure?")) return;
    fetch(`http://127.0.0.1:5000/api/users/${userId}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => fetchUsers());
  };

  // Update workflow
  const handleUpdateWorkflow = (workflowId, updates) => {
    fetch(`http://127.0.0.1:5000/api/workflows/${workflowId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
      .then(res => res.json())
      .then(() => fetchWorkflows(selectedUser));
  };

  // Delete workflow
  const handleDeleteWorkflow = (workflowId) => {
    if (!window.confirm("Delete this workflow?")) return;
    fetch(`http://127.0.0.1:5000/api/workflows/${workflowId}`, {
      method: "DELETE",
    })
      .then(() => fetchWorkflows(selectedUser));
  };

  // Health check & initial fetch
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/health")
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus("Backend not reachable"));

    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Workflow Automation System</h1>
      <p>{status}</p>

      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <br /><br />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <br /><br />
        <button type="submit">Add User</button>
      </form>

      {message && <p>{message}</p>}

      {/* User List Component */}
      <UserList
        users={users}
        onSelectUser={(id) => {
          setSelectedUser(id);
          fetchWorkflows(id);
        }}
        onUpdateUser={handleUpdate}
        onDeleteUser={handleDelete}
      />

      {/* Workflow List Component */}
      {selectedUser && (
        <WorkflowList
          workflows={workflows}
          workflowTitle={workflowTitle}
          setWorkflowTitle={setWorkflowTitle}
          addWorkflow={addWorkflow}
          onUpdateWorkflow={handleUpdateWorkflow}
          onDeleteWorkflow={handleDeleteWorkflow}
        />
      )}

    </div>
  );
}

export default App;
