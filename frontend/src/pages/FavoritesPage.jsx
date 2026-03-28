import React from 'react'
import NewsCard from '../components/NewsCard'
import { useStore } from '../store'

export default function FavoritesPage({ onNewsClick }) {
  const { favorites } = useStore()
  
  return (
    <div className="px-4 py-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        我的收藏 ({favorites.length})
      </h2>
      
      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="text-5xl mb-4">💔</div>
          <h3 className="text-gray-600 dark:text-gray-400 font-medium mb-2">暂无收藏</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            在日报中找到感兴趣的资讯，点击收藏按钮添加到这里
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map(item => (
            <NewsCard 
              key={item.id} 
              item={item} 
              onClick={onNewsClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}
