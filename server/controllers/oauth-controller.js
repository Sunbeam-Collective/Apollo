const {google} = require('googleapis');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');

const loginUser = async (req, res) => {
  /*
   * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
   * from the client_secret.json file. To get these credentials for your application, visit
   * https://console.cloud.google.com/apis/credentials.
   */
  const oauth2Client = new google.auth.OAuth2(
    YOUR_CLIENT_ID,
    YOUR_CLIENT_SECRET,
    YOUR_REDIRECT_URI // why is this i ?
  );

  // Access scopes for two non-Sign-In scopes: Read-only Drive activity and Google Calendar.
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  // Generate a secure random state value.
  const state = crypto.randomBytes(32).toString('hex');

  // Store state in the session
  req.session.state = state;

  // Generate a url that asks permissions for the Drive activity and Google Calendar scope
  const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'online',
    /** Pass in the scopes array defined above.
      * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
    // Include the state parameter to reduce the risk of CSRF attacks.
    state: state
  });

  // redirect to app
  res.redirect(authorizationUrl); // do i have to return this?

}

// should i handle errors here?
// see STEP 3 in this link:
// https://developers.google.com/identity/protocols/oauth2/web-server#node.js

// Receive the callback from Google's OAuth 2.0 server.
// this is in server/index.js

const handleResponse = async (req, res) => {
  let q = url.parse(req.url, true).query;

  if (q.error) { // An error response e.g. error=access_denied
    console.log('Error:' + q.error);
  } else if (q.state !== req.session.state) { //check state value
    console.log('State mismatch. Possible CSRF attack');
    res.end('State mismatch. Possible CSRF attack');
  } else { // Get access and refresh tokens (if access_type is offline)

    let { tokens } = await oauth2Client.getToken(q.code);
    oauth2Client.setCredentials(tokens);
  }
}

module.exports = {
  loginUser,
  handleResponse
  // getLoggedIn,
  // registerUser,
  // loginUser,
  // logoutUser
}
