import Parser from 'rss-parser'
import axios from 'axios'

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; AI-Daily/1.0)'
  }
})

// Category mapping
const categoryMap = {
  '模型': '模型发布',
  'GPT': '模型发布',
  'Claude': '模型发布',
  'Gemini': '模型发布',
  'LLM': '模型发布',
  '开源': '开源',
  '发布': '技术突破',
  '突破': '技术突破',
  '更新': '技术突破',
  '工具': '工具推荐',
  '软件': '工具推荐',
  'App': '工具推荐',
  '应用': '行业动态',
  '融资': '行业动态',
  '收购': '行业动态',
  '合作': '行业动态'
}

function categorize(title, description) {
  const text = (title + ' ' + description).toLowerCase()
  
  for (const [keyword, category] of Object.entries(categoryMap)) {
    if (text.includes(keyword.toLowerCase())) {
      return category
    }
  }
  
  return '行业动态'
}

function rateImportance(title, description) {
  let score = 3
  
  const importantKeywords = ['重磅', '首发', '突破', '革命', '震撼', 'SOTA', 'GPT-5', 'AGI', '发布']
  const secondaryKeywords = ['更新', '新版本', '升级', '支持', '推出']
  
  for (const kw of importantKeywords) {
    if (title.includes(kw) || description.includes(kw)) score = 5
  }
  
  for (const kw of secondaryKeywords) {
    if (title.includes(kw)) score = Math.max(score, 4)
  }
  
  return score
}

export async function fetchFeeds() {
  const db = getDb()
  const sources = db.prepare('SELECT * FROM sources WHERE enabled = 1 AND type = ?').all('rss')
  
  const allItems = []
  
  for (const source of sources) {
    try {
      console.log(`Fetching ${source.name}...`)
      const feed = await parser.parseURL(source.url)
      
      for (const item of feed.items.slice(0, 10)) {
        allItems.push({
          title: item.title || '无标题',
          summary: item.contentSnippet || item.content || item.description || '',
          url: item.link || item.guid || '',
          source: source.name,
          category: categorize(item.title || '', item.contentSnippet || ''),
          rating: rateImportance(item.title || '', item.contentSnippet || ''),
          isTop: item.title && (item.title.includes('重磅') || item.title.includes('首发'))
        })
      }
    } catch (error) {
      console.error(`Error fetching ${source.name}:`, error.message)
    }
  }
  
  return allItems
}

export async function fetchTwitter() {
  // Twitter scraping would require API access
  // For now, return empty array
  // In production, use Twitter API v2
  
  /*
  const twitterConfig = {
    bearerToken: process.env.TWITTER_BEARER_TOKEN
  }
  
  // This would fetch from Twitter API
  */
  
  return []
}

export function deduplicateNews(items) {
  const seen = new Set()
  return items.filter(item => {
    const key = item.title.toLowerCase().trim()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
