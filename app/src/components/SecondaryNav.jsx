import { useNavigate } from 'react-router-dom';
import {
  back_icon
} from '../assets';

function SecondaryNav() {
  const navigate = useNavigate();

  return (
    <div className='secondary-nav'>
      <button
        id='back-button'
        onClick={() => navigate(-1)} // navigate back one page
      >
        <img src={back_icon} />
        {/* {'<'} Back */}
      </button>
      <div className='secondary-nav-padding' />
    </div>
  )
}

export default SecondaryNav;
