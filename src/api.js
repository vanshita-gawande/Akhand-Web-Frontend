import axios from "axios";

// ✅ Base axios instance
const API = axios.create({
  baseURL: "http://localhost:5002/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

// Register API
export const registerUser = async (userData) => {
  const response = await API.post("/register", userData);
  return response.data;
};

// Login API
export const loginUser = async ({ email, password }) => {
  const response = await API.post("/login", { email, password });
  return response.data;
};


export default API;
