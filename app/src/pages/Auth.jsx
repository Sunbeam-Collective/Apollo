import logo from "../assets/apollo_logo.svg";
import google_logo from "../assets/google_logo.svg";
import guest_logo from "../assets/guest.svg";
import { Link } from "react-router-dom";

function Auth() {
  return (
    <div id="login-wrapper">
      <div id="login-header">
        <img src={logo} id='apollo-logo' alt="Apollo Logo" />
        <h1>Apollo</h1>
      </div>
      <div id="auth-options-wrapper">
        {/* To-do: Handle Google OAuth */}
        <Link to="" style={{ textDecoration: "none" }}>
          <button id='googleLogin'>
            <img src={google_logo} alt="Google Logo" />
            Login with Google
          </button>
        </Link>
        <Link to="/home" style={{ textDecoration: "none" }}>
          <button id='guestLogin'>
            <img src={guest_logo} alt="Google Logo" />
            Continue as Guest
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Auth;
