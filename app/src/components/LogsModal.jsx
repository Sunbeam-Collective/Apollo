import {
  useState,
  useRef
} from 'react'

function LogsModal({ handleToggleModal }) {
  const [currentTab, setCurrentTab] = useState('changelog');
  const changelogRef = useRef(null);
  const roadmapRef = useRef(null);
  const blockRef = useRef(null);

  const handleExit = (e) => {
    // only handle clicks directly on the outer 'modal'
    if (blockRef.current !== e.target) return;
    handleToggleModal();
  }

  const toggleChangelogTab = () => {
    changelogRef.current.classList.add('current');
    roadmapRef.current.classList.remove('current');
    setCurrentTab('changelog');
  }

  const toggleRoadmapTab = () => {
    changelogRef.current.classList.remove('current');
    roadmapRef.current.classList.add('current');
    setCurrentTab('roadmap');
  }

  return (
    <>
      <div ref={blockRef}  className='auth-modal-block' onClick={handleExit}>
        <div className='auth-modal-container'>
          <div className='auth-tabs-container'>
            <span ref={changelogRef}  className='auth-tab current' id='changelog-span' onClick={toggleChangelogTab}>
              Changelog
            </span>
            <span>|</span>
            <span ref={roadmapRef}  className='auth-tab' id='roadmap-span' onClick={toggleRoadmapTab}>
              Roadmap
            </span>
          </div>
          <div className='auth-body-container'>
            {(currentTab === 'changelog') ? (
              <>
                <ul className='changelog-ul'>
                  <li className='auth-modal-item' key='0.1.0'>
                    <span className='modal-item-title'>
                      v0.1.0
                    </span>
                    <span className='modal-item-desc'>
                      MVP launch!
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
                      User accounts with Google!
                    </span>
                  </li>
                  <li className='auth-modal-item' key='TBD'>
                    <span className='modal-item-title'>
                      TBD
                    </span>
                    <span className='modal-item-desc'>
                      More mixer adjustment features!
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
