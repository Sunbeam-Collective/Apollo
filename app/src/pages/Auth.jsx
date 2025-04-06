import logo from "../assets/apollo_logo.svg";
import google_logo from "../assets/google_logo.svg";
import guest_logo from "../assets/guest.svg";
import {
  useState
} from 'react'
import { Link } from "react-router-dom";
import {
  AuthFooter,
  LogsModal
} from '../components'

function Auth() {
  const [modalActive, setModalActive] = useState(false);

  const handleToggleModal = () => {
    setModalActive(!modalActive);
  }

  return (
    <>
      {modalActive &&
        <LogsModal
          handleToggleModal={handleToggleModal}
        />
      }
      <div id="login-wrapper">
        <div id="login-header">
          <img src={logo} id='apollo-logo' alt="Apollo Logo" />
          <div
            className='title-div'
            style={{
              opacity: 0, animation: 'fadeIn 0.5s ease-out forwards'
            }}
          >
            <h1>Apollo</h1>
            <span>

              by <a
                href='https://github.com/Jordid13'
                target='_blank'
                rel='noopener noreferrer'
              >jordi </a>
              and <a
                href='https://raffycastillo.com'
                target='_blank'
                rel='noopener noreferrer'
              > raffy </a>
            </span>
          </div>
        </div>
        <div
          id="auth-options-wrapper"
          style={{
            opacity: 0, animation: 'fadeIn 0.5s ease-out forwards'
          }}
        >
          <div className='button-tooltip'>
            Coming soon!
          </div>
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
        <AuthFooter
          handleToggleModal={handleToggleModal}
        />
      </div>
    </>
  );
}

export default Auth;
