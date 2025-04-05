import {
  useState,
  useEffect,
  useRef
} from 'react';

import {
  RatePicker,
  RatePickerTextInput
} from '.';

import {
  getSnappedListItem
} from '../utils/getSnappedListItem'

// Constants, free use vars for the whole component.
let mouseDown = false;
let startX, scrollLeft;
const dragMultiplier = 2;

function ControlKnobs({ props }) {
  const {
    playbackRate,
    handleSpeed
  } = props;

  // Grabbing the playbackRate picker ul element with React.
  const pickerUl = useRef(null);

  // States for 'input' with the picker ul element.
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(playbackRate * 100);
  const [editingLiPosition, setEditingLiPosition] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); // State for the error message

  /**
   * Debounces a function to prevent it from being called too frequently.
   *
   * @param {function} func - The function to debounce.
   * @param {number} delay - The delay in milliseconds before the function is executed.
   * @returns {function} A new function that, when called, will only execute the original function after the specified delay.
   * @sideEffects:
   *  - Sets a timeout to delay the execution of the function.
   *  - Clears any existing timeout if the debounced function is called again before the delay has elapsed.
   */
  const debounce = (func, delay) => {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }

  /**
   * Handles the scroll event of the slider and updates the speed.
   *
   * @param {void}
   * @returns {void}
   * @sideEffects:
   *  - Calls `getSnappedListItem` to find the list item closest to the snap point.
   *  - Extracts the value from the snapped list item and converts it to a rate.
   *  - Calls `handleSpeed` with the calculated rate.
   */
  const handleScroll = debounce(() => {
    const slider = pickerUl.current;
    if (!slider) return;
    const snapped = getSnappedListItem(slider);
    const rate = parseFloat(snapped.textContent) / 100;
    handleSpeed(rate);
  }, 500); // Adjust the delay to control the snapping frequency

  /**
   * Starts dragging the slider.
   *
   * @param {object} e - The event object.
   * @returns {void}
   * @sideEffects:
   *  - Sets `mouseDown` to true.
   *  - Programmatically scrolls the `slider` w.r.t. to the drag distance.
   *  - Modifies `slider` styles.
   */
  const startDragging = (e) => {
    const slider = pickerUl.current;
    mouseDown = true;
    startX = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    slider.style.cursor = 'grabbing';
    slider.style.transition = 'none';
  }

  /**
   * Handles the end of a drag event on the slider.
   *
   * @param {Event} e - The event object associated with the mouseup or touch end event.
   * @returns {void}
   * @sideEffects:
   *  - Sets `mouseDown` to false.
   *  - Updates the slider's style.
   *  - Calls `handleSpeed` with the snapped rate value.
   */
  const stopDragging = (e) => {
    const slider = pickerUl.current;
    mouseDown = false;
    slider.style.cursor = 'grab';
    slider.style.transition = 'scroll-behavior 0.3s ease';
    const snapped = getSnappedListItem(slider);
    const rate = parseFloat(snapped.textContent) / 100;
    handleSpeed(rate);
  }

  /**
   * Handles the move event while dragging.
   *
   * @param {Event} e - The event object associated with the mousemove or touchmove event.
   * @returns {void}
   * @sideEffects:
   *  - Prevents the default event action.
   *  - Updates the slider's scroll position.
   */
  const move = (e) => {
    const slider = pickerUl.current;
    e.preventDefault();
    if (!mouseDown) {
      return;
    }
    const x = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
    const scrollDelta = (x - startX) * dragMultiplier;
    const targetScrollLeft = scrollLeft - scrollDelta;
    slider.scrollLeft = targetScrollLeft;
  };

  /**
   * Handles the double click event on a list item.
   *
   * @param {Event} e - The event object associated with the double click event.
   * @returns {void}
   * @sideEffects:
   *  - Prevents the default event action.
   *  - Sets `isEditing` to true.
   *  - Sets `inputValue` to the `data-value` attribute of the clicked `li`.
   *  - Clears any previous error message by setting `errorMessage` to ''.
   *  - Sets the `editingLiPosition` based on the clicked `li` position.
   */
  const handleDoubleClick = (e) => {
    e.preventDefault();
    const li = e.target.closest('li');
    if (li && li.classList.contains('current')) {
      setIsEditing(true);
      setInputValue(li.dataset.value);
      setErrorMessage(''); // Clear any previous error message

      // thank you gemini
      const rect = li.getBoundingClientRect();
      const ulRect = pickerUl.current.getBoundingClientRect();

      setEditingLiPosition({
        top: rect.top - ulRect.top, // Relative to the UL
        left: rect.left - ulRect.left,  //Relative to the UL
        width: rect.width //To match the li width
      });
    }
  }

  /**
   * Handles the change event of the input field.
   *
   * @param {Event} e - The event object associated with the input change event.
   * @returns {void}
   * @sideEffects:
   *  - Updates the `inputValue` state.
   */
  const handleChange = (e) => {
    setInputValue(e.target.value);
  }

  /**
   * Handles the blur event of the input field.
   *
   * @returns {void}
   * @sideEffects:
   *  - Sets `isEditing` to false.
   *  - Sets `editingLiPosition` to null.
   *  - Clears any previous error message by setting `errorMessage` to ''.
   */
  const handleBlur = () => {
    setIsEditing(false);
    setEditingLiPosition(null);
    setErrorMessage('');
  }

  /**
   * Handles the keydown event of the input field.
   *
   * @param {Event} e - The event object associated with the keydown event.
   * @returns {void}
   * @sideEffect/s:
   *  - If the key pressed is 'Enter':
   *    - Prevents the default form submission.
   *    - Validates the `inputValue`.
   *    - If validation fails, sets an error message by updating `errorMessage`.
   *    - If validation passes, calls `handleBlur` and `handleSpeed`.
   *  - If the key pressed is 'Escape':
   *    - Calls `handleBlur`.
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newValue = parseFloat(inputValue);
      if (isNaN(newValue) || newValue < 50 || newValue > 200) {
        setErrorMessage('Please enter a value between 50 and 200.');
        return;
      }
      handleBlur();
      handleSpeed(newValue / 100);
    } else if (e.key === 'Escape') {
      handleBlur();
    }
  }

  /**
  * This hook initializes event listeners for the 'slider' ul picker.
  *
  * It runs whenever the playbackRate prop changes.
  */
  useEffect(() => {
    const slider = pickerUl.current;

    // Desktop event listeners.
    document.addEventListener('mousemove', move, false);
    document.addEventListener('mouseup', stopDragging, false);
    document.addEventListener('mouseleave', stopDragging, false);
    slider.addEventListener('mousedown', startDragging, false);
    // Mobile event listeners.
    document.addEventListener('touchmove', move, false);
    document.addEventListener('touchend', stopDragging, false);
    document.addEventListener('touchcancel', stopDragging, false);
    slider.addEventListener('touchstart', startDragging, false);

    // Programmatically snapping an li element inside the 'slider' ul element to viewport center.
    if (slider) {
      const current = slider.querySelector('.current');
      if (current) {
        const currentCenter = current.offsetLeft + current.offsetWidth / 2;
        const scrollPosition = currentCenter - slider.offsetWidth / 2;
        slider.scrollLeft = scrollPosition;
      }
    }

    // Add scroll event listener
    slider.addEventListener('wheel', handleScroll);

    return () => {
      if (slider) {
        // Desktop cleanup
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', stopDragging);
        document.removeEventListener('mouseleave', stopDragging);
        slider.removeEventListener('mousedown', startDragging);
        // Mobile cleanup
        document.removeEventListener('touchmove', move);
        document.removeEventListener('touchend', stopDragging);
        document.removeEventListener('touchcancel', stopDragging);
        slider.removeEventListener('touchstart', startDragging);
        // scroll
        slider.removeEventListener('wheel', handleScroll);
      }
    }
  }, [playbackRate]);

  return (
    <>
      <div className='control-knobs-container'>
        <div className='left-gradient'></div>
        <div className='right-gradient'></div>
        <div className='rate-picker-title'>
          <p>Speed (%)</p>
        </div>
        <div className='rate-picker-container'>
          <ul
            ref={pickerUl}
            className='rate-picker'
            onDoubleClick={handleDoubleClick}
          >
            <RatePicker playbackRate={playbackRate}/>
          </ul>
          {isEditing && editingLiPosition && (
            <RatePickerTextInput
              props={{
                inputValue,
                handleChange,
                handleBlur,
                handleKeyDown,
                editingLiPosition
              }}
            />
          )}
        </div>
        <div className='rate-picker-hint'>
          {errorMessage && (
            <div className='error-message'>{errorMessage}</div>
          )}
        </div>
      </div>
    </>
  )
}

export default ControlKnobs;
