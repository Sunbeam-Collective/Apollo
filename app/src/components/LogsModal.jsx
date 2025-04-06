import {
  useState,
  useEffect,
  useRef
} from 'react'

import {
  back_icon,
  forward_icon
} from '../assets'

function LogsModal({ handleToggleModal }) {
  const [currentTab, setCurrentTab] = useState('Changelog');
  const [inMotion, setInMotion] = useState(false);
  const tabRef = useRef(null);
  const modalRef = useRef(null);
  const blockRef = useRef(null);

  const handleExit = (e) => {
    // only handle clicks directly on the outer 'modal'
    if (blockRef.current !== e.target) return;
    modalRef.current.style.animation = `pullDown 0.3s ease-in-out forwards`;
    setTimeout(() => {
      handleToggleModal();
    }, 300);
  }

  const toggleTab = (direction) => {
    if (inMotion) return;
    setInMotion(true);

    tabRef.current.style.animation = `fadeSlideFrom${direction} 0.3s ease-out forwards`;

    if (currentTab === 'Changelog') setCurrentTab('Roadmap');
    else setCurrentTab('Changelog');

    setTimeout(() => {
      tabRef.current.style.animation = ``;
      setInMotion(false);
    }, 300); // Match the animation duration (0.3s)
  }

  useEffect(() => {
    modalRef.current.style.animation = `pullUp 0.3s ease-in-out forwards`;
    setTimeout(() => {
      modalRef.current.style.animation = ``;
    }, 300);
  }, []);

  return (
    <>
      <div ref={blockRef}  className='auth-modal-block' onClick={handleExit}>
        <div ref={modalRef} className='auth-modal-container'>
          <div className='auth-tabs-container'>
            {currentTab &&
              <>
                <button id='left-nav' onClick={() => toggleTab('Left')}>
                  <img src={back_icon} />
                </button>
              <span ref={tabRef}  className='auth-tab' id={`${currentTab}-span`}>
                  {currentTab}
                </span>
                <button id='right-nav' onClick={() => toggleTab('Right')}>
                  <img src={forward_icon} />
                </button>
              </>
            }
          </div>
          <div className='auth-body-container'>
            {(currentTab === 'Changelog') ? (
              <>
                <ul className='changelog-ul'>
                  <li className='auth-modal-item' key='0.1.0'>
                    <span className='modal-item-title'>
                      v0.1.0
                    </span>
                    <span className='modal-item-desc'>
                      MVP launch
                    </span>
                  </li>
                </ul>
              </>
            ) : (
              <>
                <ul className='roadmap-ul'>
                  <li className='auth-modal-item' key='May 2025'>
                    <span className='modal-item-title'>
                      May 2025
                    </span>
                    <span className='modal-item-desc'>
                      User accounts with Google
                    </span>
                  </li>
                  <li className='auth-modal-item' key='TBD'>
                    <span className='modal-item-title'>
                      TBD
                    </span>
                    <span className='modal-item-desc'>
                      More mixer adjustment features
                    </span>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default LogsModal;
