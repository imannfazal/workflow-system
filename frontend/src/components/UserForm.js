import { useState } from "react";
import { addUser } from "../services/api";

function UserForm({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    addUser({ name, email })
      .then(data => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setMessage("User added successfully!");
          setName("");
          setEmail("");
          onUserAdded();
        }
      })
      .catch(() => setMessage("Something went wrong"));
  };

  return (
    <>
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
    </>
  );
}

export default UserForm;
