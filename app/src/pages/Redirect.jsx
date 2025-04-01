import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { SongContext } from "../context";
import Loading from "../components/Loading";
import apolloLogo from '../assets/apollo_logo.svg'


function Redirect() {
  // return either auth or home, if logged in or not
  const navigate = useNavigate();
  const {authState, setAuthState} = useContext(SongContext)

  useEffect(() => {
    // If user is not logged in navigate to the login page (auth) else to the homepage
    if (authState) {
      setTimeout(()=> {
        navigate('/home')
      }, 3000)
    } else {
      setTimeout(()=> {
        navigate('/auth')
      }, 3000)
    }
  }, [])

  return (
    <>
      <img id='apollo-logo' src={apolloLogo} alt="Apollo Logo" />
    </>
  )
}

export default Redirect;
