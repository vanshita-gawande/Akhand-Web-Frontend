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

// ------------------ AUTH APIs ------------------

// Get current user (explicit token support)
export const getMe = async (token) => {
  const res = await API.get("/auth/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined, // fallback if no token
  });
  return res.data; // returns { user: {...} }
};

// Register API
export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// Login API
export const loginUser = async ({ email, password, role }) => {
  const response = await API.post("/auth/login", { email, password, role });
  const token = response.data.token;

  // Save token immediately
  localStorage.setItem("token", token);

  // Fetch profile so UI can show user info
  const me = await getMe(); // ✅ explicitly pass token
  return { token, user: me.user };
};

// ------------------ VENUES ------------------
export const getVenues = async () => {
  const response = await API.get("/venues");
  return response.data;
};

export const addVenue = async (venueData) => {
  const response = await API.post("/venues/register", venueData);
  return response.data;
};

export const updateVenue = async (id, venue) => {
  const { data } = await API.put(`/venues/${id}`, venue);
  return data;
};

export const deleteVenue = async (id) => {
  const { data } = await API.delete(`/venues/${id}`);
  return data;
};

// ------------------ BOOKINGS ------------------
export const bookVenue = async (bookingData) => {
  const token = localStorage.getItem("token");
  const response = await API.post("/bookings", bookingData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserBookings = async () => {
  const res = await API.get("/bookings/my-bookings");
  return res.data;
};

export const cancelBooking = async (bookingId) => {
  const token = localStorage.getItem("token");
  const response = await API.patch(`/bookings/cancel/${bookingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAdminBookings = async () => {
  const res = await API.get("/bookings/all-bookings");
  return res.data;
};

// ------------------ STATS ------------------
export const getStats = async () => {
  const { data } = await API.get("/stats");
  return data;
};

// ------------------ PAYMENTS ------------------
export const createOrder = async (amount) => {
  const { data } = await API.post("/payments/create-order", { amount });
  return data;
};

export const verifyPayment = async (paymentData, bookingDetails) => {
  const { data } = await API.post("/payments/verify-payment", {
    ...paymentData,
    bookingDetails,
  });
  return data;
};

//----------------------------------------SUPERADMIN---------------------------------------
// ------------------ SUPER ADMIN ------------------
export const getSuperAdminOverview = async () => {
  const { data } = await API.get("/superadmin/overview");
  return data;
};

export const getAllAdmins = async () => {
  const { data } = await API.get("/superadmin/admins");
  return data;
};

export const createAdmin = async (adminData) => {
  const { data } = await API.post("/superadmin/admins", adminData);
  return data;
};

export const deleteAdmin = async (id) => {
  const { data } = await API.delete(`/superadmin/admins/${id}`);
  return data;
};

export const getAllUsers = async () => {
  const { data } = await API.get("/superadmin/users");
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await API.delete(`/superadmin/users/${id}`);
  return data;
};

//----------------------EMAIL--------------
export const sendEmail = async (emailData) => {
  const response = await API.post("/email/send", emailData);
  return response.data;
};

export default API;
