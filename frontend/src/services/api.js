const BASE_URL = "http://127.0.0.1:5000";

export const getHealth = () => {
  return fetch(`${BASE_URL}/api/health`).then(res => res.json());
};

export const getUsers = () => {
  return fetch(`${BASE_URL}/api/users`).then(res => res.json());
};

export const addUser = (user) => {
  return fetch(`${BASE_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  }).then(res => res.json());
};
