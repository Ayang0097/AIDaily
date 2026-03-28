import React, { useState } from 'react'
import { useStore } from '../store'
import { format } from 'date-fns'

export default function NewsDetailPage({ news, onBack }) {
  const { toggleFavorite, isFavorite } = useStore()
  const [expanded, setExpanded] = useState(false)
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiAnswer, setAiAnswer] = useState(null)
  const [isAsking, setIsAsking] = useState(false)
  
  if (!news) {
    return (
      <div className="p-4">
        <p className="text-gray-500">资讯不存在</p>
      </div>
    )
  }
  
  const favorite = isFavorite(news.id)
  
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
  
  const handleAskAI = async () => {
    if (!aiQuestion.trim()) return
    
    setIsAsking(true)
    setAiAnswer(null)
    
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const answers = [
      `关于"${news.title}"，我认为这是一个重要的进展。它反映了行业趋势，即各公司都在加大对AI的投入。对从业者来说，这意味着需要持续学习新技术。`,
      `从技术角度分析，这条资讯涉及到 ${news.category} 领域。核心看点在于其创新点和商业化潜力。建议关注后续的用户反馈和市场表现。`,
      `这个问题很有深度！结合当前AI发展趋势，我认为这项技术将推动行业向更高效、更智能的方向发展。短期内可能会有一些挑战，但长期看好。`
    ]
    
    setAiAnswer(answers[Math.floor(Math.random() * answers.length)])
    setIsAsking(false)
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      {/* Header */}
      <div className="px-4 py-3 flex items-center border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-30">
        <button 
          onClick={onBack}
          className="text-2xl text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 mr-3"
        >
          ←
        </button>
        <h1 className="font-semibold text-gray-800 dark:text-gray-100">资讯详情</h1>
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Tags */}
        <div className="flex items-center gap-2 mb-4">
          <span className="ai-badge">🤖 AI摘要</span>
          <span className={`category-tag ${getCategoryStyle(news.category)}`}>
            {news.category}
          </span>
        </div>
        
        {/* Title */}
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-snug">
          {news.title}
        </h1>
        
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-5">
          <span>📅 {format(new Date(news.date), 'yyyy-MM-dd')}</span>
          <span>📍 {news.source}</span>
          <span className="text-yellow-500">{renderStars(news.rating)}</span>
        </div>
        
        {/* AI Comment */}
        {news.comment && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-4 mb-4">
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-2 flex items-center">
              <span className="mr-1">💡</span>
              AI一句话点评
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
              "{news.comment}"
            </p>
          </div>
        )}
        
        {/* Summary - Expandable */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 flex items-center justify-between">
            <span className="flex items-center">
              <span className="mr-1">📝</span>
              完整摘要
            </span>
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-indigo-600 dark:text-indigo-400 text-xs"
            >
              {expanded ? '收起' : '展开'}
            </button>
          </div>
          <p className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed ${!expanded && 'line-clamp-3'}`}>
            {news.summary}
          </p>
        </div>
        
        {/* AI Chat Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <span className="mr-2">🤖</span>
            关于这条资讯，问AI
          </h3>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
              placeholder="例如：这对行业有什么影响？"
              className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-100 dark:placeholder-gray-400"
            />
            <button
              onClick={handleAskAI}
              disabled={isAsking || !aiQuestion.trim()}
              className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-indigo-700 transition"
            >
              {isAsking ? '⏳' : '问AI'}
            </button>
          </div>
          
          {/* AI Answer */}
          {isAsking && (
            <div className="ai-chat-bubble">
              <div className="flex items-center">
                <div className="text-xl mr-2">🤖</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">AI思考中...</div>
                <div className="ml-2 flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                </div>
              </div>
            </div>
          )}
          
          {aiAnswer && (
            <div className="ai-chat-bubble animate-fadeIn">
              <div className="flex items-start">
                <div className="text-xl mr-2 flex-shrink-0">🤖</div>
                <div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1">AI助手</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{aiAnswer}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Original Link */}
        {news.url && news.url !== '#' && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
              <span className="mr-1">🔗</span>
              原文链接
            </h3>
            <a 
              href={news.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 text-sm break-all hover:underline"
            >
              {news.url}
            </a>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button 
            onClick={() => toggleFavorite(news)}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
              favorite 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {favorite ? '❤️ 已收藏' : '🤍 收藏'}
          </button>
          <button 
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: news.title,
                  text: news.summary,
                  url: news.url || window.location.href
                })
              }
            }}
          >
            ↗️ 分享
          </button>
        </div>
      </div>
    </div>
  )
}
