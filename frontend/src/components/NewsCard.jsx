import React from 'react'
import { useStore } from '../store'

export default function NewsCard({ item, onClick }) {
  const { toggleFavorite, isFavorite } = useStore()
  const favorite = isFavorite(item.id)
  
  const getCategoryStyle = (category) => {
    switch(category) {
      case '模型发布':
      case '技术突破':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
      case '工具推荐':
        return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
      case '行业动态':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
      case '开源':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }
  
  const renderStars = (count) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count)
  }
  
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-2xl p-4 card-shadow transition-all cursor-pointer animate-fadeIn ${
        item.isTop ? 'border-l-4 border-indigo-500' : ''
      } hover:shadow-lg`}
      onClick={() => onClick(item)}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        {item.isTop && (
          <span className="ai-badge">🤖 AI摘要</span>
        )}
        <span className={`category-tag ${getCategoryStyle(item.category)}`}>
          {item.category}
        </span>
        {item.isTop && (
          <span className="text-xs text-gray-400 dark:text-gray-500">置顶</span>
        )}
      </div>
      
      {/* Title */}
      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 leading-snug">
        {item.title}
      </h3>
      
      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 mb-2">
        <span>📍 {item.source}</span>
        <span className="text-yellow-500">{renderStars(item.rating)}</span>
      </div>
      
      {/* Summary */}
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
        {item.summary}
      </p>
      
      {/* Actions */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <button 
          className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
          onClick={(e) => {
            e.stopPropagation()
            onClick(item)
          }}
        >
          查看详情
        </button>
        <button 
          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
            favorite 
              ? 'text-red-500 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50' 
              : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(item)
          }}
        >
          {favorite ? '❤️ 已收藏' : '🤍 收藏'}
        </button>
        <button 
          className="text-xs text-gray-400 dark:text-gray-500 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            // Share logic
            if (navigator.share) {
              navigator.share({
                title: item.title,
                text: item.summary,
                url: item.url || window.location.href
              })
            }
          }}
        >
          ↗️ 分享
        </button>
      </div>
    </div>
  )
}
