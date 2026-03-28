import React, { useState } from 'react'
import { useStore } from '../store'
import { format, subDays } from 'date-fns'

export default function HistoryPage({ onNewsClick }) {
  const { history } = useStore()
  const [selectedDate, setSelectedDate] = useState('2026-03-27')
  
  // Generate date options for the strip
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i)
    return {
      date: format(date, 'yyyy-MM-dd'),
      day: format(date, 'd'),
      weekday: format(date, 'E')
    }
  })
  
  return (
    <div>
      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 transition-colors">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2.5 flex items-center">
          <span className="text-gray-400 mr-3">🔍</span>
          <input 
            type="text" 
            placeholder="搜索历史资讯..." 
            className="bg-transparent flex-1 text-sm outline-none text-gray-800 dark:text-gray-200"
          />
        </div>
      </div>
      
      {/* Date Strip */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide transition-colors">
        <div className="flex gap-2 min-w-max">
          {dates.map(d => (
            <div 
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`date-picker-item ${
                selectedDate === d.date 
                  ? 'date-picker-item-active' 
                  : 'date-picker-item-inactive'
              }`}
            >
              <div className="text-xs opacity-70">{d.weekday}</div>
              <div className="text-base font-medium">{d.day}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* History List */}
      <div className="px-4 py-4 space-y-3">
        {history.map(item => (
          <div 
            key={item.date}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 card-shadow cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNewsClick(item)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {item.date.replace('2026-', '').replace('-', '月')}日
                </div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mt-1">
                  AI日报 #{item.id}
                </h3>
              </div>
              <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2.5 py-1 rounded-full">
                {item.count}条
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {item.preview}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
