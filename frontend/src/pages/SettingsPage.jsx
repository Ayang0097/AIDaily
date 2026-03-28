import React from 'react'
import { useStore } from '../store'

export default function SettingsPage() {
  const { settings, updateSettings, toggleDarkMode } = useStore()
  
  const settingGroups = [
    {
      title: '📱 推送设置',
      items: [
        {
          label: '开启推送',
          type: 'toggle',
          key: 'pushEnabled',
          desc: '每日早8点推送日报到微信'
        },
        {
          label: '推送时间',
          type: 'time',
          key: 'pushTime',
          desc: '每天准时送达'
        }
      ]
    },
    {
      title: '🎨 界面设置',
      items: [
        {
          label: '深色模式',
          type: 'darktoggle',
          key: 'darkMode',
          desc: '保护眼睛，适合夜间阅读'
        }
      ]
    },
    {
      title: '📡 资讯来源',
      items: [
        { label: '虎嗅', type: 'source' },
        { label: '爱范儿', type: 'source' },
        { label: '钛媒体', type: 'source' },
        { label: '少数派', type: 'source' },
        { label: 'Solidot', type: 'source' },
        { label: '36kr', type: 'source' }
      ]
    },
    {
      title: '🔧 其他',
      items: [
        { label: '清除缓存', type: 'action', icon: '🗑️' },
        { label: '关于我们', type: 'link', icon: 'ℹ️' },
        { label: '反馈建议', type: 'link', icon: '💬' }
      ]
    }
  ]
  
  return (
    <div className="px-4 py-4 space-y-4">
      {settingGroups.map((group, idx) => (
        <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden card-shadow">
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{group.title}</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {group.items.map((item, itemIdx) => (
              <div 
                key={itemIdx}
                className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </div>
                  {item.desc && (
                    <div className="text-xs text-gray-400 mt-0.5 dark:text-gray-500">{item.desc}</div>
                  )}
                </div>
                <div>
                  {item.type === 'toggle' && (
                    <button
                      onClick={() => updateSettings({ [item.key]: !settings[item.key] })}
                      className={`toggle-switch ${settings[item.key] ? 'active' : 'inactive'}`}
                    >
                      <div className={`toggle-knob ${settings[item.key] ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  )}
                  {item.type === 'darktoggle' && (
                    <button
                      onClick={toggleDarkMode}
                      className={`toggle-switch ${settings.darkMode ? 'active' : 'inactive'}`}
                    >
                      <div className={`toggle-knob ${settings.darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  )}
                  {item.type === 'time' && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">{settings[item.key]}</span>
                  )}
                  {item.type === 'source' && (
                    <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                  )}
                  {item.type === 'action' && (
                    <span className="text-gray-400">→</span>
                  )}
                  {item.type === 'link' && (
                    <span className="text-gray-400">→</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="text-center py-6 text-xs text-gray-400 dark:text-gray-500">
        <p>AI日报 v1.1.0</p>
        <p className="mt-1">Made with ❤️ by AI</p>
      </div>
    </div>
  )
}
