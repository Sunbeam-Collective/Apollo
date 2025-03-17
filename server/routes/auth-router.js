const express = require('express');
const session = require('express-session');
const url = require('url');
const router = express.Router();
// const AuthController = require('../controllers/auth-controller')
const OAuthController = require('../controllers/oauth-controller');

// router.post('/register', AuthController.registerUser)
// router.post('/login', AuthController.loginUser)
// router.get('/logout', AuthController.logoutUser)
// router.get('/loggedIn', AuthController.getLoggedIn)



// Receive the callback from Google's OAuth 2.0 server.
router.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}))

router.get('/login', OAuthController.loginUser);
router.get('/logout', OAuthController.logoutUser);
// TODO: am i handling this right?
router.get('/oauth2callback', OAuthController.handleResponse);


module.exports = authRouter
