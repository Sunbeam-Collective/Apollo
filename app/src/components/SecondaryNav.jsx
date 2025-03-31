import {
  useState,
  useContext
} from 'react'

import {
  useNavigate,
  useLocation,
  useParams
} from 'react-router-dom';

import {
  back_icon,
  popout_icon,
  queue_icon
} from '../assets';

import {
  PlayerPopout
} from '.'
import ReactDOM from 'react-dom/client'

import {
  SongContext
} from '../context';

function SecondaryNav({ props }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTab } = useContext(SongContext);
  const { id } = useParams();

  const handleClick = () => {
    if (location.pathname.startsWith("/player")) {
      navigate(`/home`, { state: { from: location.pathname } });
    } else if (location.pathname.startsWith("/mixer")) {
      navigate(`/player/${id}`, { state: { from: location.pathname } });
    }
  };


  const handlePopout = async () => {
    const pipWindow = await window.documentPictureInPicture.requestWindow();
    const pipDiv = pipWindow.document.createElement('div');
    pipDiv.setAttribute('id', 'pip-root');
    pipWindow.document.body.append(pipDiv);
    const PIP_ROOT = ReactDOM.createRoot(
      pipWindow.document.getElementById('pip-root')
    )
    PIP_ROOT.render(<PlayerPopout />);
    pipWindow.addEventListener('unload', () => {
      console.log('you closed the popout!');
      setPopoutIsOpen(false);
    })
    setPopoutIsOpen(true);
  }


  const handleQueue = () => {
    const { handleQueueToggle } = props;
    handleQueueToggle();
  }

  const handleHelp = () => {
    const { handleHelp } = props;
    handleHelp();
  }

  return (
    <div className="secondary-nav">
      <button
        id="back-button"
        onClick={handleClick} // navigate back one page
      >
        <img src={back_icon} />
        {/* {'<'} Back */}
      </button>
      <div className='secondary-nav-padding'></div>
      {(location.pathname.startsWith('/player')) ? (
        <button
          id='queue-button'
          onClick={handleQueue}
        >
          <img src={queue_icon} />
        </button>
      ) : (
        <button
          id='help-button'
          onClick={handleHelp}
        >
          <img src={popout_icon} />
        </button>
      )
      }
    </div>
  );
}

export default SecondaryNav;
