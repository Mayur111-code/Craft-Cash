// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const cookieParser = require('cookie-parser');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ----- REQUIRED TO READ JSON -----
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // ----- CORS -----
// app.use(cors({
//   origin: ['https://craft-cash-alpha.vercel.app' || "http://localhost:5173/"
//     ],
//   credentials: true,
// }));

// // ----- DATABASE -----
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));

// // ----- ROUTES -----
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/expenses", require("./routes/expenses"));
// app.use("/api/ai", require("./routes/ai"));

// app.get("/", (req, res) => {
//   res.send("API CONNECTED ...");
// });

// // ----- ERROR HANDLER -----
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ message: "Server Error" });
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));








const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CORS - MUST BE FIRST
// ============================================
app.use(cors({
  origin: 'https://craft-cash-alpha.vercel.app',
  credentials: true,
}));

// Handle preflight for ALL routes (FIXED - use regex instead of *)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', 'https://craft-cash-alpha.vercel.app');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    return res.status(204).send();
  }
  next();
});

// ============================================
// BODY PARSERS
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ============================================
// DEBUG LOGGER
// ============================================
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

// ============================================
// DATABASE
// ============================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Error:', err.message);
  });

// ============================================
// ROUTES
// ============================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/ai', require('./routes/ai'));

// Test route
app.get('/', (req, res) => {
  res.json({ status: 'API Running', port: PORT });
});

// ============================================
// ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: err.message || 'Server Error' });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});