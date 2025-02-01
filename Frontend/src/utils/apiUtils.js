import axios from 'axios';

// export const axiosInstance = axios.create({
//   baseURL: 'http://localhost:8080',
//   headers: { 'Content-Type': 'application/json' },
// });

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'multipart/form-data' },
});
