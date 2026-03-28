import React from 'react'

export default function NavBar({ currentPage, onNavigate }) {
  const navItems = [
    { id: 'home', icon: '📰', label: '日报' },
    { id: 'history', icon: '📚', label: '历史' },
    { id: 'favorites', icon: '❤️', label: '收藏' },
    { id: 'settings', icon: '⚙️', label: '设置' }
  ]
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 py-2 z-50 transition-colors">
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`nav-item py-1 px-4 transition-colors ${
              currentPage === item.id || (currentPage === 'detail' && item.id === 'home')
                ? 'nav-item-active'
                : 'nav-item-inactive'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="mt-1 text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
