import React from 'react'

const categories = ['全部', '模型发布', '技术突破', '工具推荐', '行业动态', '开源']

export default function CategoryTabs({ selected, onSelect }) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 transition-colors">
      <div className="flex overflow-x-auto scrollbar-hide px-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              selected === cat 
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
