import express from 'express'
import cors from 'cors'
import { initDatabase, getDb } from './db.js'
import { fetchFeeds, fetchTwitter } from './scraper.js'
import { generateSummary } from './ai.js'
import { scheduleJobs } from './scheduler.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Initialize database
initDatabase()

// API Routes

// Get latest daily report
app.get('/api/daily/latest', (req, res) => {
  try {
    const db = getDb()
    const daily = db.prepare(`
      SELECT * FROM dailies 
      ORDER BY date DESC 
      LIMIT 1
    `).get()
    
    if (!daily) {
      return res.json({ error: 'No daily report found' })
    }
    
    const news = db.prepare(`
      SELECT * FROM news 
      WHERE daily_id = ? 
      ORDER BY is_top DESC, rating DESC
    `).all(daily.id)
    
    res.json({ ...daily, news })
  } catch (error) {
    console.error('Error fetching latest daily:', error)
    res.status(500).json({ error: 'Failed to fetch daily report' })
  }
})

// Get daily report by date
app.get('/api/daily/:date', (req, res) => {
  try {
    const { date } = req.params
    const db = getDb()
    
    const daily = db.prepare(`
      SELECT * FROM dailies 
      WHERE date = ?
    `).get(date)
    
    if (!daily) {
      return res.status(404).json({ error: 'Daily report not found' })
    }
    
    const news = db.prepare(`
      SELECT * FROM news 
      WHERE daily_id = ? 
      ORDER BY is_top DESC, rating DESC
    `).all(daily.id)
    
    res.json({ ...daily, news })
  } catch (error) {
    console.error('Error fetching daily:', error)
    res.status(500).json({ error: 'Failed to fetch daily report' })
  }
})

// Get all dailies (history)
app.get('/api/dailies', (req, res) => {
  try {
    const db = getDb()
    const dailies = db.prepare(`
      SELECT d.*, COUNT(n.id) as news_count 
      FROM dailies d
      LEFT JOIN news n ON n.daily_id = d.id
      GROUP BY d.id
      ORDER BY d.date DESC
      LIMIT 30
    `).all()
    
    res.json(dailies)
  } catch (error) {
    console.error('Error fetching dailies:', error)
    res.status(500).json({ error: 'Failed to fetch dailies' })
  }
})

// Search news
app.get('/api/search', (req, res) => {
  try {
    const { q } = req.query
    if (!q) {
      return res.status(400).json({ error: 'Search query required' })
    }
    
    const db = getDb()
    const results = db.prepare(`
      SELECT * FROM news 
      WHERE title LIKE ? OR summary LIKE ?
      ORDER BY created_at DESC
      LIMIT 50
    `).all(`%${q}%`, `%${q}%`)
    
    res.json(results)
  } catch (error) {
    console.error('Error searching:', error)
    res.status(500).json({ error: 'Failed to search' })
  }
})

// Get sources
app.get('/api/sources', (req, res) => {
  try {
    const db = getDb()
    const sources = db.prepare(`SELECT * FROM sources WHERE enabled = 1`).all()
    res.json(sources)
  } catch (error) {
    console.error('Error fetching sources:', error)
    res.status(500).json({ error: 'Failed to fetch sources' })
  }
})

// Admin: Regenerate daily report
app.post('/api/admin/regenerate', async (req, res) => {
  try {
    const { date } = req.body
    console.log(`Regenerating daily report for ${date}...`)
    
    // Fetch fresh data
    const feedItems = await fetchFeeds()
    const twitterItems = await fetchTwitter()
    
    // Combine and deduplicate
    const allItems = [...feedItems, ...twitterItems]
    const uniqueItems = deduplicateNews(allItems)
    
    // Generate summaries with AI
    const processedItems = await Promise.all(
      uniqueItems.map(async (item) => {
        const summary = await generateSummary(item)
        return { ...item, ...summary }
      })
    )
    
    // Save to database
    const db = getDb()
    
    // Delete existing if any
    const existingDaily = db.prepare(`SELECT * FROM dailies WHERE date = ?`).get(date)
    if (existingDaily) {
      db.prepare(`DELETE FROM news WHERE daily_id = ?`).run(existingDaily.id)
      db.prepare(`DELETE FROM dailies WHERE id = ?`).run(existingDaily.id)
    }
    
    // Create new daily
    const dailyResult = db.prepare(`
      INSERT INTO dailies (date, news_count, created_at)
      VALUES (?, ?, datetime('now'))
    `).run(date, processedItems.length)
    
    const dailyId = dailyResult.lastInsertRowid
    
    // Insert news
    const insertNews = db.prepare(`
      INSERT INTO news (daily_id, title, summary, comment, source, category, rating, url, is_top, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `)
    
    for (const item of processedItems) {
      insertNews.run(
        dailyId,
        item.title,
        item.summary,
        item.comment || null,
        item.source,
        item.category,
        item.rating || 3,
        item.url,
        item.isTop ? 1 : 0
      )
    }
    
    res.json({ 
      success: true, 
      message: `Daily report regenerated with ${processedItems.length} items`,
      dailyId
    })
  } catch (error) {
    console.error('Error regenerating daily:', error)
    res.status(500).json({ error: 'Failed to regenerate daily report' })
  }
})

// Admin: Delete daily
app.delete('/api/admin/daily/:date', (req, res) => {
  try {
    const { date } = req.params
    const db = getDb()
    
    const daily = db.prepare(`SELECT * FROM dailies WHERE date = ?`).get(date)
    if (!daily) {
      return res.status(404).json({ error: 'Daily report not found' })
    }
    
    db.prepare(`DELETE FROM news WHERE daily_id = ?`).run(daily.id)
    db.prepare(`DELETE FROM dailies WHERE id = ?`).run(daily.id)
    
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting daily:', error)
    res.status(500).json({ error: 'Failed to delete daily report' })
  }
})

// Helper: Deduplicate news
function deduplicateNews(items) {
  const seen = new Set()
  return items.filter(item => {
    const key = item.title.toLowerCase().trim()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI日报 API server running on http://localhost:${PORT}`)
  
  // Schedule background jobs
  scheduleJobs()
})
