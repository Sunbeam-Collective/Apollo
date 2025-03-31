import {
  SongContext
} from '../context';

import {
  dot_marker
} from '../assets'

import {
  getSnappedListItem
} from '../utils/getSnappedListItem'

import {
  useState,
  useEffect,
  useRef
} from 'react';


// constants, free use vars
let mouseDown = false;
let startX, scrollLeft;
const dragMultiplier = 4;

function ControlKnobs({ props }) {
  const {
    playbackRate,
    handleSpeed
  } = props;

  const pickerUl = useRef(null);
  const [isInitRender, setIsInitRender] = useState(true);

  useEffect(() => {
    const slider = pickerUl.current;

    /* LISTENERS */
    // desktop
    document.addEventListener('mousemove', move, false);
    document.addEventListener('mouseup', stopDragging, false);
    document.addEventListener('mouseleave', stopDragging, false);
    slider.addEventListener('mousedown', startDragging, false);
    // mobile
    document.addEventListener('touchmove', move, false);
    document.addEventListener('touchend', stopDragging, false);
    document.addEventListener('touchcancel', stopDragging, false);
    slider.addEventListener('touchstart', startDragging, false);

    // start the render at playbackRate 100
    const centerOnInitialRender = () => {
      if (slider) {
        const element100 = slider.querySelector('[data-value="100"]');
        if (element100) {
          const elementCenter = element100.offsetLeft + element100.offsetWidth / 2;
          const scrollPosition = elementCenter - slider.offsetWidth / 2;
          slider.scrollLeft = scrollPosition;
        }
      }
    };

    // only do it on first render
    if (isInitRender) {
      centerOnInitialRender();
      setIsInitRender(false);
    }

    // cleanup
    return () => {
      if (slider) {
        // desktop
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', stopDragging);
        document.removeEventListener('mouseleave', stopDragging);
        slider.removeEventListener('mousedown', startDragging);
        // mobile
        document.removeEventListener('touchmove', move);
        document.removeEventListener('touchend', stopDragging);
        document.removeEventListener('touchcancel', stopDragging);
        slider.removeEventListener('touchstart', startDragging);
      }
    }

  }, [playbackRate]); // for now just based on playbackrate i guess?

  // handlers
  // i did not figure this out, gemini did
  // basically the logic for being able to simulate a horizontal scroll
  // with a mousedrag, and then detecting which list item it "snaps" on
  // so we could pull that value and assign the playbackRate with it
  function startDragging(e) {
    const slider = pickerUl.current;
    mouseDown = true;
    startX = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    slider.style.cursor = 'grabbing';
    slider.style.transition = 'none';
  }

  function stopDragging(e) {
    const slider = pickerUl.current;
    mouseDown = false;
    slider.style.cursor = 'grab';
    slider.style.transition = 'scroll-behavior 0.3s ease';

    // getting the snapped value to update rate
    const snapped = getSnappedListItem(slider);
    handleSpeed(snapped);
  }

  function move(e) {
    const slider = pickerUl.current;
    e.preventDefault();
    if (!mouseDown) {
      return;
    }

    const x = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
    const scrollDelta = (x - startX) * dragMultiplier;
    const targetScrollLeft = scrollLeft - scrollDelta;

    let closestSnapPoint = null;
    let minDistance = Infinity;

    slider.querySelectorAll('li.rate-value').forEach(listItem => {
      const snapPoint = listItem.offsetLeft - (slider.offsetWidth - listItem.offsetWidth) / 2;  // Center the item
      const distance = Math.abs(targetScrollLeft - snapPoint);

      if (distance < minDistance) {
        minDistance = distance;
        closestSnapPoint = snapPoint;
      }
    });

    if (closestSnapPoint !== null) {
        slider.scrollLeft = closestSnapPoint;
    } else {
        slider.scrollLeft = targetScrollLeft;
    }
  };

  return (
    <>
      <div className='control-knobs-container'>
        <div className='left-gradient'></div>
        <div className='right-gradient'></div>
        <div className='rate-picker-title'>
          <p>Speed (%)</p>
        </div>
        <div className='rate-picker-container'>
          <ul className='rate-picker' ref={pickerUl}>
            {
              new Array(151)
                .fill(0.5)
                .map((v,i) => Math.round((v+(i*0.01))*100))
                .map((v) => {
                  let className = 'rate-value'
                  if (v / 100 === playbackRate) className += ' current'
                  return (
                    <>
                      <li
                        key={crypto.randomUUID()}
                        data-value={v}
                        className={className}
                      >
                        <p className='item-text'>{v}</p>
                        {
                          (v / 100 === playbackRate) &&
                          <img src={dot_marker} />
                        }
                      </li>
                    </>
                  )
                })
            }
          </ul>
        </div>
        <div className='rate-picker-hint'>
        </div>
      </div>
    </>
  )
}

export default ControlKnobs;
