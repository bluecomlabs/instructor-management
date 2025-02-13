// import axios from 'axios';

// const apiUrl = import.meta.env.VITE_API_URL;

// const api = axios.create({
//   baseURL: `${apiUrl}:8081`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
// src/utils/api.ts
// const apiBaseUrl = import.meta.env.VITE_API_URL;

// 이거 기존에 쓰던건데 백엔드 포트랑 겹쳐서 밑에 따로 명시함
// export const ApiUrl = (endpoint: string) => {
//   return `${apiBaseUrl}${endpoint}`;
// };

// 개발용
const apiBaseUrl = "http://localhost:8080/v1";

export const ApiUrl = (endpoint: string) => {
  return `${apiBaseUrl}${endpoint}`;
};

// export default api;