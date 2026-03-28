import React, { createContext, useContext } from 'react'
import { useStore } from '../store'

const DarkModeContext = createContext()

export function DarkModeProvider({ children }) {
  const { settings, toggleDarkMode } = useStore()
  
  return (
    <DarkModeContext.Provider value={{ 
      isDark: settings.darkMode, 
      toggleDark: toggleDarkMode 
    }}>
      <div className={settings.darkMode ? 'dark' : ''}>
        {children}
      </div>
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  return useContext(DarkModeContext)
}
