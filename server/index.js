const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const path = require('path');
require('dotenv').config();
// if ever i need these
// const cors = require('cors');
// const cookieParser = require('cookie-parser');


// creating a server
const app = express();
const PORT = process.env.PORT || 4000;
// what is this part for?
// const pathToFrontendDist = path.join(__dirname, '../app/dist');

// setting up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// if i need to setup cors
// app.use(cors({
//   origin: ["http://localhost:3000"],
//   credentials: true,
// }))
// if i need to setup cookie parser
// app.use(cookieParser());

// routers as middleware (for file organization)
// oauth routes
// const authRouter = require('./routes/auth-router');
// app.use('/auth', authRouter);

// init session with secret
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}))

// passport because self-implementing auth exploded my brain a bit
app.use(passport.initialize());
app.use(passport.session());

// cors
app.use(cors({
  origin: `${process.env.CLIENT_URL}`,
  methods: "GET, POST, PUT, DELETE",
  credentials: true,
}))

passport.use(
  new GoogleStrategy(
    { // opts
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.GOOGLE_REDIRECT_URI}/auth/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
)

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// we are only getting email from GoogleAPI
app.get(
  "/auth/login",
  passport.authenticate("google", { scope: ["email"] }),
)

app.get(
  "/auth/failed",
  (req, res) => {
    res.status(401).json({
      success: false,
      message: "login failure",
    })
  }
)

app.get(
  "/auth/success",
  (req, res) => {
    console.log(req);
    res.status(200).json({
      success: true,
      message: "login success",
      user: req.user
    })
  }
)

// data flows here
app.get(
  "/auth/callback",
  passport.authenticate("google",
    {
      successRedirect: "/auth/success",
      failureRedirect: "/auth/failed",
    }
  )
)

app.get(
  "/auth/logout",
  (req, res) => {
    req.logout(() => {
      console.log('user logged out');
    })
  }
)



// const appRouter = require('./routes/app-router');
// app.use('/api', appRouter);

// initializing db object
const run = require('./db');
run('error', console.error.bind(console, 'MongoDB connection error:'));

// open the server (listening mode)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


/* MARCY PATTERN */

// Instead of defining all of the controllers in this file, we've moved them to their own folder
// const {
//   serveFellows,
//   serveFellow,
//   createFellow,
//   updateFellow,
//   deleteFellow
// } = require('./controllers/fellowControllers');

// ////////////////////////
// // Middleware
// ////////////////////////

// const logRoutes = (req, res, next) => {
//   const time = (new Date()).toLocaleString();
//   req.time = time;
//   console.log(`${req.method}: ${req.originalUrl} - ${time}`);
//   next();
// };

// const serveStatic = express.static(pathToFrontendDist);

// // A new middleware has appeared!
// // This parses incoming requests with JSON data in the body
// // Access the data using `req.body`
// const parseJSON = express.json();

// app.use(logRoutes);   // Print out every incoming request
// app.use(serveStatic); // Serve static public/ content
// app.use(parseJSON);   // Parses request body JSON

// ////////////////////////
// // Endpoints
// ////////////////////////

// // calling endpoints as middleware


// // app.get('/api/fellows', serveFellows);
// // app.get('/api/fellows/:id', serveFellow);
// // app.post('/api/fellows', createFellow);
// // app.patch('/api/fellows/:id', updateFellow);
// // app.delete('/api/fellows/:id', deleteFellow);

// // app.get('*', (req, res, next) => {
// //   if (req.originalUrl.startsWith('/api')) return next();
// //   res.sendFile(pathToFrontendDist);
// // });


// app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));
