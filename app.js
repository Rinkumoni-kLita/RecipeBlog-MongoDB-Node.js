require('dotenv').config();
console.log("Mongo URI:", process.env.MONGODB_URI); // for debugging

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3004;

// MongoDB connection
mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

//// Middleware setup here (express layouts, sessions, etc.)

//// Start server and listen on all network interfaces
app.listen(port, '0.0.0.0', () => {
  console.log(`🌐 Server is running on port ${port}`);
});
