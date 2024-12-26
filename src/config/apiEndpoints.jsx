const API_URL = import.meta.env.VITE_API_URL

export const API_ENDPOINTS = {
  LOGIN: `${API_URL}/users/login`,
  GET_ALL_USERS: `${API_URL}/users/getAll`,
  CREATE_USER: `${API_URL}/users/create`,
  UPDATE_USER: `${API_URL}/users/update`,
};