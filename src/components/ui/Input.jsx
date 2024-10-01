// src/components/ui/Input.jsx

export function Input({ 
    id, 
    name, 
    type = 'text', 
    placeholder, 
    value, 
    onChange, 
    required = false, 
    className = '', 
    ...props 
  }) {
    return (
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
        {...props}
      />
    );
  }
  