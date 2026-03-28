import React, { useState } from 'react'

export default function ShareSheet({ news, onClose }) {
  const [copied, setCopied] = useState(false)
  
  const shareOptions = [
    { id: 'wechat', icon: '💬', label: '微信', color: 'bg-green-500' },
    { id: 'moments', icon: '🧣', label: '朋友圈', color: 'bg-yellow-500' },
    { id: 'weibo', icon: '🔴', label: '微博', color: 'bg-red-500' },
    { id: 'twitter', icon: '🐦', label: 'Twitter', color: 'bg-blue-400' },
    { id: 'link', icon: '🔗', label: '复制链接', color: 'bg-gray-500' }
  ]
  
  const handleShare = async (platform) => {
    if (platform === 'link') {
      const url = news.url || window.location.href
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      return
    }
    
    // In production, this would use native share APIs
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.summary,
          url: news.url || window.location.href
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    }
    
    onClose()
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-md p-6 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">分享到</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{news.title}</p>
        </div>
        
        <div className="grid grid-cols-5 gap-4 mb-6">
          {shareOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleShare(opt.id)}
              className="flex flex-col items-center"
            >
              <div className={`w-12 h-12 ${opt.color} rounded-full flex items-center justify-center text-xl mb-1 transition-transform hover:scale-110`}>
                {opt.icon}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">{opt.label}</span>
            </button>
          ))}
        </div>
        
        {copied && (
          <div className="text-center text-sm text-green-600 dark:text-green-400 mb-4">
            ✓ 链接已复制到剪贴板
          </div>
        )}
        
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium"
        >
          取消
        </button>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
