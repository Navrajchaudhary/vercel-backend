const express = require("express");
const authRoutes = require('../routes/authRoutes')
const cookieParser = require('cookie-parser')
const cors = require("cors")

const app = express();

// middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

const allowedOrigins = [
  "https://21s49z81-5173.inc1.devtunnels.ms",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());


// prefix api
app.use('/api/auth', authRoutes)

module.exports = app;
