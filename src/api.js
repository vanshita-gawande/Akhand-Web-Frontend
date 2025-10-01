import axios from "axios";

// ✅ Base axios instance , here we set the base URL for all requests i.e the app always knows the home addess and then instead of writing the whole address everytime we write only the endpoint
const API = axios.create({
  baseURL: "http://localhost:5002/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token automatically to all requests , This is an axios interceptor → it runs before every request. It fetches the token from localStorage and adds it to the Authorization header if it exists and hence no need to add token manually.
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------ AUTH APIs------------------

// Get current user
export const getMe = async () => {
  const res = await API.get("/auth/me"); //Calls GET /auth/me -> backend uses the token to find the logged-in user.
  return res.data; // and returns { user: {...} }
};

// Register API
export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData); // Calls POST /auth/register with user details (name, email, password, etc).Backend creates a new user.
  return response.data;
};

// Login API
export const loginUser = async ({ email, password, role }) => {
  const response = await API.post("/auth/login", { email, password, role }); // these are end points which actually calls  http://localhost:5002/api/venues this address here and backend response with a token and user details
  const token = response.data.token;

  // Save token immediately
  localStorage.setItem("token", token);

  // Fetch profile so UI can show user info
  const me = await getMe();
  return { token, user: me.user };
};

// ------------------ VENUES ------------------

// this is for admin
// Get all venues ,Calls GET /venues and Returns an array of venues (from your database).
export const getVenues = async () => {
  const response = await API.get("/venues");
  return response.data;
};

// Add new venue ,Calls POST /venues/register with venue details (name, location, sport, etc).Backend adds venue to DB.
export const addVenue = async (venueData) => {
  const response = await API.post("/venues/register", venueData);
  return response.data;
};

//  New for update and delete
export const updateVenue = async (id, venue) => {
  const { data } = await API.put(`/venues/${id}`, venue);
  return data;
};

export const deleteVenue = async (id) => {
  const { data } = await API.delete(`/venues/${id}`);
  return data;
};

// ------------------ BOOKINGS ------------------
//Book a venue by logged-in user
export const bookVenue = async (bookingData) => {
  const token = localStorage.getItem("token"); // stored after login

  const response = await API.post("/bookings", bookingData, {
    headers: {
      Authorization: `Bearer ${token}` // ✅ send token
    }
  });

  return response.data;
};

//  Get bookings of current user
export const getUserBookings = async () => {
  const res = await API.get("/bookings/my-bookings");
  return res.data;
};
// Cancel a booking by its ID
export const cancelBooking = async (bookingId) => {
  const token = localStorage.getItem("token");
  const response = await API.delete(`/bookings/${bookingId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // send token
    },
  });
  return response.data; // backend should return a success message or the deleted booking
};

// Get all bookings (admin)
export const getAdminBookings = async () => {
  const res = await API.get("/bookings/all-bookings"); // ✅ correct path
  return res.data;
};

// ------------------ STATS ------------------
export const getStats = async () => {
  const { data } = await API.get("/stats");
  return data;
};


// ------------------ PAYMENTS ------------------

// 1. Create an order on backend
export const createOrder = async (amount) => {
  const { data } = await API.post("/payments/create-order", { amount });
  return data; // will return {id, amount, currency, ...}
};

// 2. Verify payment after Razorpay popup success
export const verifyPayment = async (paymentData, bookingDetails) => {
  const { data } = await API.post("/payments/verify-payment", {
    ...paymentData,
    bookingDetails, // send booking form data
  });
  return data; // {status: "success", booking: {...}}
};


export default API;