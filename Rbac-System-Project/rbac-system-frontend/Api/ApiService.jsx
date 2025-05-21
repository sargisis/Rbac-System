import axios from "axios"

const API = "http://localhost:3000/api";


export const login = (data) => axios.post(`${API}/login`, data);
export const activateAccount = (data) => axios.post(`${API}/activate`, data);


export const createUser = (data, token) =>
  axios.post(`${API}/users`, data, {
    headers: { Authorization: `Bearer ${token}` },
});

export const requestActivation = (data) =>
  axios.post(`${API}/request-reset`, data);

export const resetPassword = (data) =>
  axios.post(`${API}/reset-password`, data);

export const fetchUsers = (token) =>
  axios.get(`${API}/users`, {
    headers: { Authorization: `Bearer ${token}` },
});

export const updateUser = (id, data, token) =>
  axios.put(`${API}/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
});

export const getUserById = (id, token) =>
  axios.get(`${API}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
});

export const deleteUser = (id, token) =>
  axios.delete(`${API}/edit/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
});

export const uploadAvatar = (userId, file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return axios.put(`http://localhost:3000/api/users/${userId}/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAvatarUrl = (avatar) => {
  if (!avatar) return "";
  return avatar.startsWith("http") ? avatar : `http://localhost:3000${avatar}`;
};