// import axios from 'axios';

// const apiUrl = import.meta.env.VITE_API_URL;

// const api = axios.create({
//   baseURL: `${apiUrl}:8081`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
// src/utils/api.ts
const apiBaseUrl = import.meta.env.VITE_API_URL;

export const ApiUrl = (endpoint: string) => {
  return `${apiBaseUrl}${endpoint}`;
};

// export default api;