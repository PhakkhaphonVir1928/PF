require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const cors = require('cors');

// Initialize express app
const app = express();
const port = 3000;

// Middleware setup
app.use(express.json()); // To handle JSON payloads
app.set('view engine', 'ejs');  // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views'));  // Make sure views are in the 'views' folder
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files (e.g., CSS, JS)
app.use(
  session({
    secret: process.env.SECRET || 'my_super_secret_key',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(cors());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err.message);
    return;
  }
  console.log('Connected to MySQL Database!');
});

// Routes
app.get('/', (req, res) => {
  res.render('home');  // Render home.ejs for the home route
});

app.get('/register', (req, res) => {
  res.render('register', { message: req.flash('message') });
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html')); // ส่งไฟล์ login.html ไปยังผู้ใช้
});

// Register route to handle form data and insert into the database
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate form data
  if (!username || !email || !password) {
    req.flash('message', 'All fields are required!');
    return res.redirect('/register');
  }

  try {
    // Check if the email is already in use
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], async (err, results) => {
      if (err) {
        console.error('Error checking email:', err);
        req.flash('message', 'Error checking email!');
        return res.redirect('/register');
      }

      if (results.length > 0) {
        req.flash('message', 'Email already in use');
        return res.redirect('/register');
      }

      // Hash the password
      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(insertQuery, [username, email, hashedPassword], (err, result) => {
          if (err) {
            console.error('Error inserting user:', err);
            req.flash('message', 'Error registering user!');
            return res.redirect('/register');
          }

          // Send success JSON response
          res.status(200).json({
            success: true,
            message: 'Registration successful!',
            data: { username, email },
          });
        });
      } catch (error) {
        console.error('Error hashing password:', error);
        req.flash('message', 'Error registering user!');
        return res.redirect('/register');
      }
    });
  } catch (error) {
    console.error('Error in /register:', error);
    req.flash('message', 'Internal Server Error');
    res.redirect('/register');
  }
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err || results.length === 0) {
      req.flash('message', 'Invalid email or password!');
      return res.redirect('/login');
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      req.session.userId = user.id;
      res.redirect('/secrets');
    } else {
      req.flash('message', 'Invalid email or password!');
      res.redirect('/login');
    }
  });
});

app.get('/secrets', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.render('secrets');  // Render secrets page if the user is logged in
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${3000}`);
});
