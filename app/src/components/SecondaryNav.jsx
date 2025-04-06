import {
  useNavigate,
  useLocation,
  useParams
} from 'react-router-dom';

import ReactDOM from 'react-dom/client'

import {
  PlayerPopout
} from '.'

import {
  back_icon,
  help_icon,
  queue_icon
} from '../assets';

function SecondaryNav({ props }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Handles navigation based on the current route.
   * If on the player route, navigates to home. If on the mixer route, navigates to the player route with the current ID.
   *
   * @param {void}
   * @returns {void}
   * @sideEffects:
   *  - Navigates the user to a new route using the `navigate` function.
   */
  const handleClick = () => {
    if (location.pathname.startsWith("/player")) {
      navigate(`/home`, { state: { from: location.pathname } });
    } else if (location.pathname.startsWith("/mixer")) {
      navigate(`/player/${id}`, { state: { from: location.pathname } });
    }
  };

  /**
   * Only handled from the Player page. Toggles render of the queue modal.
   *
   * @param {void}
   * @returns {void}
   * @sideEffects:
   *  - Calls the `handleQueueToggle` function which updates the state one level above to reflect on the page this component is on.
   */
  const handleQueue = () => {
    const { handleQueueToggle } = props;
    handleQueueToggle();
  }

  /**
   * Only handled from the Mixer page. Toggles render of the help modal.
   *
   * @returns {void}
   * @sideEffects:
   *  - Calls the `handleHelp` function which toggles the help modal for the Mixer page.
   */
  const handleHelp = () => {
    const { handleToggleHelp } = props;
    handleToggleHelp();
  }

  return (
    <div className="secondary-nav">
      <button
        id="back-button"
        onClick={handleClick}
      >
        <img src={back_icon} />
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
          <img src={help_icon} />
        </button>
      )
      }
    </div>
  );
}

// IN PROGRESS: Player app popout feature
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
    // console.log('you closed the popout!');
    setPopoutIsOpen(false);
  })
  setPopoutIsOpen(true);
}

export default SecondaryNav;
