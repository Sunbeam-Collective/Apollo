const cors = require('cors');
const session = require('express-session');
const express = require('express');
const path = require('path');
require('dotenv').config();
// if ever i need these
// const cors = require('cors');
// const cookieParser = require('cookie-parser');

const { connect } = require('./db');


// creating a server
const app = express();
const PORT = process.env.PORT || 4000;
// what is this part for?
// const pathToFrontendDist = path.join(__dirname, '../app/dist');

// setting up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}))
// cors
app.use(cors({
  origin: `${process.env.CLIENT_URL}`,
  methods: "GET, POST, PUT, DELETE",
  credentials: true,
}))

// routers as middleware (for file organization)
// oauth routes
const authRouter = require('./routes/auth-router');
app.use('/auth', authRouter);








// const appRouter = require('./routes/app-router');
// app.use('/api', appRouter);

// initialize db then run server
connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  })


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
