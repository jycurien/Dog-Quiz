const Button = ({ handleClick, children, disabled }) => {
  return (
    <button type='button' onClick={handleClick} disabled={disabled}>
      {children}
    </button>
  )
}

export default Button
