import { create } from 'zustand'
import { format } from 'date-fns'

// Mock news data
const mockNews = [
  {
    id: '1',
    title: 'OpenAI发布GPT-5，性能全面超越GPT-4',
    summary: 'OpenAI在凌晨发布了下一代大语言模型，在推理能力、多模态理解、数学竞赛等多个基准测试中达到SOTA，参数规模据传达到10万亿。',
    comment: 'GPT-5的发布标志着AGI竞赛进入新阶段，但更值得关注的是其推理效率的提升——参数大了10倍，推理成本仅增加3倍，这才是真正的突破。',
    source: '虎嗅',
    category: '模型发布',
    rating: 5,
    date: new Date().toISOString(),
    url: 'https://www.huxiu.com/article/2345678.html',
    isTop: true
  },
  {
    id: '2',
    title: 'Anthropic发布Claude 3.5新版本',
    summary: '新版本在代码生成能力上提升40%，支持更长上下文窗口，数学推理能力显著增强。',
    source: '爱范儿',
    category: '技术突破',
    rating: 4,
    date: new Date().toISOString(),
    url: '#'
  },
  {
    id: '3',
    title: '🔧 Cursor新版本支持中文注释生成',
    summary: 'AI代码编辑器Cursor发布重大更新，现在支持自动生成中文注释，对中文开发者更友好。',
    source: '少数派',
    category: '工具推荐',
    rating: 3,
    date: new Date().toISOString(),
    url: '#'
  },
  {
    id: '4',
    title: '💼 微软宣布AI商业化新战略',
    summary: '微软CEO纳德拉宣布将Copilot深度整合到Office全家桶，企业版定价公布。',
    source: '36kr',
    category: '行业动态',
    rating: 4,
    date: new Date().toISOString(),
    url: '#'
  },
  {
    id: '5',
    title: '🤖 Google开源Gemini Nano',
    summary: 'Google宣布开源Gemini Nano小模型，可在移动端运行，性能超越GPT-3.5。',
    source: 'Solidot',
    category: '开源',
    rating: 5,
    date: new Date().toISOString(),
    url: '#'
  },
  {
    id: '6',
    title: '📱 苹果AI功能曝光：本地运行大模型',
    summary: '据报道，苹果正在开发本地运行的AI模型将应用于iPhone，保护用户隐私。',
    source: '钛媒体',
    category: '行业动态',
    rating: 4,
    date: new Date().toISOString(),
    url: '#'
  }
]

// Mock history data
const mockHistory = [
  { date: '2026-03-27', id: 142, count: 8, preview: 'GPT-5发布预告 · Claude新功能 · Midjourney V6...' },
  { date: '2026-03-26', id: 141, count: 10, preview: 'Gemini Pro开放 · 开源模型突破 · AI硬件...' },
  { date: '2026-03-25', id: 140, count: 12, preview: 'AI Agent爆发 · 自动编程工具 · 算力竞争...' },
  { date: '2026-03-24', id: 139, count: 9, preview: '大模型价格战 · 新品发布 · 技术突破...' },
  { date: '2026-03-23', id: 138, count: 11, preview: 'AI监管动态 · 开源进展 · 产品更新...' }
]

export const useStore = create((set, get) => ({
  // News
  news: [],
  selectedCategory: '全部',
  isLoading: false,
  isRefreshing: false,
  
  fetchNews: async () => {
    set({ isLoading: true })
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    set({ news: mockNews, isLoading: false })
  },
  
  refreshNews: async () => {
    set({ isRefreshing: true })
    await new Promise(resolve => setTimeout(resolve, 1000))
    set({ news: mockNews, isRefreshing: false })
  },
  
  setCategory: (category) => {
    set({ selectedCategory: category })
  },
  
  getFilteredNews: () => {
    const { news, selectedCategory } = get()
    if (selectedCategory === '全部') return news
    return news.filter(item => item.category === selectedCategory)
  },
  
  // Favorites
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  
  toggleFavorite: (newsItem) => {
    const { favorites } = get()
    const exists = favorites.find(f => f.id === newsItem.id)
    let newFavorites
    if (exists) {
      newFavorites = favorites.filter(f => f.id !== newsItem.id)
    } else {
      newFavorites = [...favorites, newsItem]
    }
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    set({ favorites: newFavorites })
  },
  
  isFavorite: (id) => {
    return get().favorites.some(f => f.id === id)
  },
  
  // History
  history: mockHistory,
  
  // Settings
  settings: JSON.parse(localStorage.getItem('settings') || JSON.stringify({
    pushTime: '08:00',
    pushEnabled: true,
    darkMode: localStorage.getItem('darkMode') === 'true',
    sources: ['虎嗅', '爱范儿', '钛媒体', '少数派', 'Solidot', '36kr']
  })),
  
  updateSettings: (newSettings) => {
    const updated = { ...get().settings, ...newSettings }
    if ('darkMode' in newSettings) {
      localStorage.setItem('darkMode', String(newSettings.darkMode))
    }
    localStorage.setItem('settings', JSON.stringify(updated))
    set({ settings: updated })
  },
  
  toggleDarkMode: () => {
    const newDarkMode = !get().settings.darkMode
    localStorage.setItem('darkMode', String(newDarkMode))
    set({ settings: { ...get().settings, darkMode: newDarkMode } })
  }
}))
