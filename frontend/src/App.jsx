import React, { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import HistoryPage from './pages/HistoryPage'
import FavoritesPage from './pages/FavoritesPage'
import SettingsPage from './pages/SettingsPage'
import NewsDetailPage from './pages/NewsDetailPage'
import { useStore } from './store'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedNews, setSelectedNews] = useState(null)
  const { news, fetchNews, settings } = useStore()
  
  useEffect(() => {
    fetchNews()
  }, [fetchNews])
  
  // Apply dark mode class
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [settings.darkMode])
  
  const handleNavigate = (page) => {
    setCurrentPage(page)
    setSelectedNews(null)
  }
  
  const handleNewsClick = (item) => {
    setSelectedNews(item)
    setCurrentPage('detail')
  }
  
  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage news={news} onNewsClick={handleNewsClick} />
      case 'history':
        return <HistoryPage onNewsClick={handleNewsClick} />
      case 'favorites':
        return <FavoritesPage onNewsClick={handleNewsClick} />
      case 'settings':
        return <SettingsPage />
      case 'detail':
        return <NewsDetailPage news={selectedNews} onBack={() => handleNavigate('home')} />
      default:
        return <HomePage news={news} onNewsClick={handleNewsClick} />
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-4 sticky top-0 z-40">
        <div className="text-xs opacity-90">
          {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </div>
        <h1 className="text-xl font-bold mt-1">AI日报</h1>
        <p className="text-xs opacity-90 mt-1">
          {news.length > 0 ? `共${news.length}条资讯 · 阅读约${Math.ceil(news.length * 0.7)}分钟` : '加载中...'}
        </p>
      </header>
      
      {/* Main Content */}
      <main className="pb-20 bg-gray-50 dark:bg-gray-900 transition-colors">
        {renderPage()}
      </main>
      
      {/* Bottom Navigation */}
      <NavBar currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  )
}

export default App
