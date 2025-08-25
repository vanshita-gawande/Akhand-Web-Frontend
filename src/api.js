import axios from "axios";

// ✅ Base axios instance
const API = axios.create({
  baseURL: "http://localhost:5002/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});
 // Get current user with token
 export const getMe = async (token) => {
   const res = await API.get("/me", {
     headers: { Authorization: `Bearer ${token}` },
   });
   return res.data; // { user: {...} }
 };
// Register API
export const registerUser = async (userData) => {
  const response = await API.post("/register", userData);
  return response.data;
  
};

// Login API
export const loginUser = async ({ email, password }) => {
  const response = await API.post("/login", { email, password });
  const token = response.data.token;
  // Immediately fetch profile so UI can show real name
  const me = await getMe(token); // { user }
  return { token, user: me.user };
};


export default API;
