function UserList({ users, onSelectUser, onUpdateUser, onDeleteUser }) {
  return (
    <>
      <h2>Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id} style={{ marginBottom: "8px" }}>
              {user.name} ({user.email}){" "}
              <button onClick={() => onSelectUser(user.id)}>View Workflows</button>{" "}
              <button onClick={() => onUpdateUser(user.id)}>Update</button>{" "}
              <button onClick={() => onDeleteUser(user.id)} style={{ color: "red" }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default UserList;
