import { useEffect, useState } from "react";
import { getHealth, getUsers } from "./services/api";
import Status from "./components/Status";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";

function App() {
  const [status, setStatus] = useState("Loading...");
  const [users, setUsers] = useState([]);

  const loadUsers = () => {
    getUsers().then(data => setUsers(data));
  };

  useEffect(() => {
    getHealth()
      .then(data => setStatus(data.status))
      .catch(() => setStatus("Backend not reachable"));

    loadUsers();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Workflow Automation System</h1>
      <Status status={status} />
      <UserForm onUserAdded={loadUsers} />
      <UserList users={users} />
    </div>
  );
}

export default App;
