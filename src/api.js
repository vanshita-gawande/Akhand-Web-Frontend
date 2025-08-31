import axios from "axios";

// ✅ Base axios instance
const API = axios.create({
  baseURL: "http://localhost:5002/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token automatically to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------ AUTH ------------------

// Get current user
export const getMe = async () => {
  const res = await API.get("/auth/me");
  return res.data; // { user: {...} }
};

// Register API
export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// Login API
export const loginUser = async ({ email, password }) => {
  const response = await API.post("/auth/login", { email, password });
  const token = response.data.token;

  // Save token immediately
  localStorage.setItem("token", token);

  // Fetch profile so UI can show user info
  const me = await getMe();
  return { token, user: me.user };
};

// ------------------ VENUES ------------------

// Get all venues
export const getVenues = async () => {
  const response = await API.get("/venues");
  return response.data;
};

// Add new venue
export const addVenue = async (venueData) => {
  const response = await API.post("/venues", venueData);
  return response.data;
};

export default API;
