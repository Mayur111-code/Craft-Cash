// import axios from 'axios';

// const api = axios.create({
//     baseURL: 'https://craft-cash.onrender.com/api', //import.meta.env.VITE_API_URL || 'http://localhost:5000/api' ||
//     withCredentials: true,
// });

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default api;


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 CORS (TOP PE HI HONA CHAHIYE)
app.use(cors({
  origin: [
    "https://craft-cash-alpha.vercel.app", // production frontend
    "http://localhost:5173" // local dev
  ],
  credentials: true,
}));

// 🔥 PREFLIGHT FIX (VERY IMPORTANT)
app.options('*', cors());

// ----- BODY PARSERS -----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ----- DATABASE -----
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ----- ROUTES -----
app.use("/api/auth", require("./routes/auth"));
app.use("/api/expenses", require("./routes/expenses"));
app.use("/api/ai", require("./routes/ai"));

app.get("/", (req, res) => {
  res.send("API CONNECTED ...");
});

// ----- ERROR HANDLER -----
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server Error" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));