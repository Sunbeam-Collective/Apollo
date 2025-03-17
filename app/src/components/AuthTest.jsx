
const handleLogin = (e) => {
  e.preventDefault();
  console.log(import.meta.env.VITE_SERVER_URL);
  window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/login`
}

function AuthTest() {
  console.log(import.meta.env.SERVER_URL);
  return (
    <>
      <h1>Here goes all testing i guess</h1>
      <button onClick={handleLogin}>login with google</button>
    </>
  )
}

export default AuthTest;
