export function Button({ children, variant = 'default', className = '', ...props }) {
  const baseStyles = 'px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants = {
    default: 'bg-white text-black border-black hover:bg-black hover:text-white hover:border-black',
    outline: 'bg-white text-black border-black hover:bg-black hover:text-white hover:border-black'
  }

  const classes = `${baseStyles} ${variants[variant]} ${className}`

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}