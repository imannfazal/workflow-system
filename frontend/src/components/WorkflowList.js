function WorkflowList({ workflows, workflowTitle, setWorkflowTitle, addWorkflow, onUpdateWorkflow, onDeleteWorkflow }) {
  return (
    <>
      <h2>Workflows</h2>

      <input
        type="text"
        placeholder="Workflow title"
        value={workflowTitle}
        onChange={e => setWorkflowTitle(e.target.value)}
      />
      <button onClick={addWorkflow} style={{ marginLeft: "8px" }}>
        Add Workflow
      </button>

      {workflows.length === 0 ? (
        <p>No workflows found.</p>
      ) : (
        <ul>
          {workflows.map(w => (
            <li key={w.id} style={{ marginTop: "10px" }}>
              <b>{w.title}</b> - {w.status}

              <select
                value={w.status}
                onChange={(e) => onUpdateWorkflow(w.id, { status: e.target.value })}
                style={{ marginLeft: "10px" }}
              >
                <option value="Pending">Pending</option>
                <option value="Running">Running</option>
                <option value="Completed">Completed</option>
              </select>

              <button
                onClick={() => {
                  const newTitle = prompt("New workflow title:", w.title);
                  if (newTitle) onUpdateWorkflow(w.id, { title: newTitle });
                }}
                style={{ marginLeft: "8px" }}
              >
                Update
              </button>

              <button
                onClick={() => onDeleteWorkflow(w.id)}
                style={{ marginLeft: "8px", color: "red" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default WorkflowList;
