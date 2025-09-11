// ==================
// Import Modules
// ==================
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
require('dotenv').config();

// ==================
// Initialize App
// ==================
const app = express();
const port = process.env.PORT || 3000;

// ==================
// MongoDB Connection
// ==================
mongoose.set('strictQuery', true); // 👈 Fix warning here

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ==================
// Middleware
// ==================
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
  secret: 'CookingBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());

// ==================
// View Engine
// ==================
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// ==================
// Routes
// ==================
const routes = require('./server/routes/recipeRoutes.js');
app.use('/', routes);

// ==================
// Start Server
// ==================
app.listen(port, () => console.log(`🚀 Listening on port ${port}`));
