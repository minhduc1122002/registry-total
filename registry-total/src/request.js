import axios from "axios";

const BASE_URL = "http://localhost:8000/api/";
const TOKEN = JSON.parse(localStorage.getItem('accessToken'))

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `${TOKEN}` },
});