import React from 'react'
import NewsCard from '../components/NewsCard'
import CategoryTabs from '../components/CategoryTabs'
import PullToRefresh from '../components/PullToRefresh'
import { PageSkeleton } from '../components/Skeleton'
import { useStore } from '../store'

export default function HomePage({ news, onNewsClick }) {
  const { selectedCategory, setCategory, getFilteredNews, isLoading, isRefreshing, refreshNews } = useStore()
  const filteredNews = getFilteredNews()
  
  const handleRefresh = async () => {
    await refreshNews()
  }
  
  if (isLoading) {
    return (
      <div>
        <CategoryTabs selected={selectedCategory} onSelect={setCategory} />
        <PageSkeleton />
      </div>
    )
  }
  
  return (
    <div>
      <CategoryTabs 
        selected={selectedCategory} 
        onSelect={setCategory} 
      />
      
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="px-4 py-4 space-y-3">
          {filteredNews.length === 0 ? (
            <div className="empty-state">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-lg font-medium mb-2">暂无资讯</h3>
              <p className="text-sm opacity-70">下拉刷新试试</p>
            </div>
          ) : (
            filteredNews.map(item => (
              <NewsCard 
                key={item.id} 
                item={item} 
                onClick={onNewsClick}
              />
            ))
          )}
        </div>
      </PullToRefresh>
    </div>
  )
}
