import { createContext, useContext, useState } from 'react'

const TabsContext = createContext()

export function Tabs({ children, defaultValue, onValueChange }) {
  const [value, setValue] = useState(defaultValue)

  const handleValueChange = (newValue) => {
    setValue(newValue)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      {children}
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className = '', ...props }) {
  return (
    <div className={`inline-flex items-center justify-center rounded-md bg-muted p-1 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function TabsTrigger({ children, value, className = '', ...props }) {
  const { value: selectedValue, onValueChange } = useContext(TabsContext)
  const isSelected = value === selectedValue

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
        ${isSelected ? 'bg-black text-white' : 'bg-white text-black'}
        hover:bg-black hover:text-white hover:border-black border border-black transition-colors duration-300 ${className}`}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  )
}

export function TabsContent({ children, value, className = '', ...props }) {
  const { value: selectedValue } = useContext(TabsContext)

  if (value !== selectedValue) {
    return null
  }

  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}
