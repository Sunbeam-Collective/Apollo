
function AuthFooter({ handleToggleModal }) {
  return (
    <div className='auth-footer-container'>
      <a
        href='https://github.com/Sunbeam-Collective/Apollo'
        target='_blank'
        rel='noopener noreferrer'
        style={{
          color: 'white',
          textDecoration: 'underline'
        }}
      >
        github
      </a>
      <span style={{ color: '#FFE30E'}}>|</span>
      <span
        className='changelog-roadmap-button'
        onClick={handleToggleModal}
        style={{
          color: 'white',
          textDecoration: 'underline'
        }}
      >
        v0.1.0
      </span>
    </div>
  )
}

export default AuthFooter;
