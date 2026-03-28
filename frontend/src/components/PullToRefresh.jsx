import React, { useState, useRef } from 'react'

export default function PullToRefresh({ onRefresh, children }) {
  const [pulling, setPulling] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)
  
  const handleTouchStart = (e) => {
    startY.current = e.touches[0].pageY
  }
  
  const handleTouchMove = (e) => {
    const y = e.touches[0].pageY
    if (y > startY.current && y > 100 && !refreshing) {
      setPulling(true)
    }
  }
  
  const handleTouchEnd = async () => {
    if (pulling && !refreshing) {
      setRefreshing(true)
      setPulling(false)
      await onRefresh()
      setRefreshing(false)
    }
  }
  
  return (
    <div 
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull Indicator */}
      <div className={`pull-indicator ${pulling ? 'pulling' : ''} ${refreshing ? 'refreshing' : ''}`}>
        <div className="h-16 flex items-center justify-center">
          {refreshing ? (
            <div className="text-2xl animate-spin">⏳</div>
          ) : pulling ? (
            <div className="text-2xl">↓</div>
          ) : (
            <div className="text-gray-400 text-sm">下拉刷新</div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className={`transition-transform ${pulling ? 'translate-y-8' : ''}`}>
        {children}
      </div>
    </div>
  )
}
