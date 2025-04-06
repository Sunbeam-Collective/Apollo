
function RatePickerTextInput({ props }) {
  const {
    inputValue,
    handleChange,
    handleBlur,
    handleKeyDown,
    editingLiPosition
  } = props;

  return (
    <input
      type='number'
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      autoFocus
      className='floating-input'
      style={{
        top: editingLiPosition.top + 'px',
        left: editingLiPosition.left + 'px',
        width: editingLiPosition.width + 'px',
      }}
    />
  )
}

export default RatePickerTextInput;
