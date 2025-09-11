// Load environment variables
require('dotenv').config();
console.log("Mongo URI:", process.env.MONGODB_URI); // for debugging

// Import dependencies
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const path = require('path');

// Import your Mongoose models
const Category = require('./server/models/Category'); // adjust path if needed
const Recipe = require('./server/models/Recipe');     // adjust path if needed

// Initialize app
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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(flash());
app.use(expressLayouts);

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// File upload middleware (optional, if used)
app.use(fileUpload());

// ===== Root Route =====
app.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    const food = {
      latest: await Recipe.find({}).sort({ createdAt: -1 }).limit(5),
      thai: await Recipe.find({ category: 'Thai' }).limit(5),
      american: await Recipe.find({ category: 'American' }).limit(5),
      chinese: await Recipe.find({ category: 'Chinese' }).limit(5)
    };

    res.render('index', { categories, food });
  } catch (err) {
    console.error(err);
    res.render('index', { categories: [], food: {} });
  }
});

// You can add more routes here, e.g. for categories, recipe details, submission etc.

// ===== Start Server =====
app.listen(port, '0.0.0.0', () => {
  console.log(`🌐 Server is running on port ${port}`);
});
