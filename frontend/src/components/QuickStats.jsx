import React from 'react'
import { format, subDays } from 'date-fns'

export default function QuickStats() {
  const stats = [
    { 
      label: '今日阅读', 
      value: '12', 
      unit: '篇',
      icon: '📖',
      color: 'from-blue-500 to-indigo-500'
    },
    { 
      label: '本周收藏', 
      value: '8', 
      unit: '篇',
      icon: '❤️',
      color: 'from-red-500 to-pink-500'
    },
    { 
      label: '连续阅读', 
      value: '5', 
      unit: '天',
      icon: '🔥',
      color: 'from-orange-500 to-yellow-500'
    },
    { 
      label: '节省时间', 
      value: '40', 
      unit: '分钟',
      icon: '⏱️',
      color: 'from-green-500 to-teal-500'
    }
  ]
  
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 mb-6">
      <h3 className="text-white/80 text-sm mb-4 flex items-center">
        <span className="mr-2">📊</span>
        今日统计
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg">{stat.icon}</span>
              <span className="text-xs text-white/60">{stat.unit}</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-white/70">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
