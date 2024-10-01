export function Textarea({ 
  id, 
  name, 
  placeholder, 
  value, 
  onChange, 
  required = false, 
  rows = 4, 
  className = '', 
  ...props 
}) {
  return (
    <textarea
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      rows={rows}
      className={`w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none ${className}`}
      {...props}
    />
  )
}