const express = require('express');
const url = require('url');
const router = express.Router();
// const AuthController = require('../controllers/auth-controller')
const OAuthController = require('../controllers/oauth-controller');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/user-model')
const { getDb } = require('../db');

// router.post('/register', AuthController.registerUser)
// router.post('/login', AuthController.loginUser)
// router.get('/logout', AuthController.logoutUser)
// router.get('/loggedIn', AuthController.getLoggedIn)



// Receive the callback from Google's OAuth 2.0 server.

// passport because self-implementing auth exploded my brain a bit
router.use(passport.initialize());
router.use(passport.session());
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

// auth flow
router.get(
  "/login",
  passport.authenticate("google", { scope: ["email"] }),
)
router.get(
  "/logout",
  (req, res) => {
    req.logout(() => {
      res.status(200).json({
        success: true,
        message: "logout success",
      })
    });
  }
)
router.get(
  "/login/failed",
  (req, res) => {
    res.status(401).json({
      success: false,
      message: "login failure",
    })
  }
)
router.get(
  "/login/success",
  async (req, res) => {
    console.log(req);
    // check if user already exists, make new entry if not
    const email = req.user._json.email;
    const db = getDb();
    let user = await db.collection('users').findOne({ email });
    if (!user) {
      user = new User({
        username: email.slice(0,email.indexOf('@')),
        email: email,
        pictureUrl: req.user._json.picture,
        ownTracks: [],
        savedTracks: [],
        projects: [],
      })
      await db.collection('users').insertOne(user);
    }
    res.status(200).json({
      success: true,
      message: "login success",
      user: user
    })
  }
)
router.get(
  "/callback",
  passport.authenticate("google",
    {
      successRedirect: "/auth/login/success",
      failureRedirect: "/auth/login/failed",
    }
  )
)

// router.get('/login', OAuthController.loginUser);
// router.get('/logout', OAuthController.logoutUser);
// // TODO: am i handling this right?
// router.get('/oauth2callback', OAuthController.handleResponse);


module.exports = router;
