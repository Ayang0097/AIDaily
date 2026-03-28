import schedule from 'node-schedule'
import { format } from 'date-fns'

export function scheduleJobs() {
  // Daily report generation at 6:00 AM
  schedule.scheduleJob('0 6 * * *', async () => {
    console.log('⏰ Running scheduled daily report generation...')
    try {
      await generateDailyReport()
    } catch (error) {
      console.error('Scheduled job failed:', error)
    }
  })
  
  // Twitter check every 20 minutes (if configured)
  schedule.scheduleJob('*/20 * * * *', async () => {
    console.log('🔍 Checking Twitter for AI news...')
    // Twitter check logic would go here
  })
  
  console.log('✅ Scheduled jobs initialized')
  console.log('   - Daily report: 06:00 AM')
  console.log('   - Twitter check: Every 20 minutes')
}

async function generateDailyReport() {
  const { fetchFeeds, deduplicateNews } = await import('./scraper.js')
  const { generateSummary } = await import('./ai.js')
  const { getDb } = await import('./db.js')
  
  const today = format(new Date(), 'yyyy-MM-dd')
  
  // Fetch feeds
  const items = await fetchFeeds()
  const uniqueItems = deduplicateNews(items)
  
  // Process with AI
  const processedItems = await Promise.all(
    uniqueItems.map(async item => {
      const summary = await generateSummary(item)
      return { ...item, ...summary }
    })
  )
  
  // Save to database
  const db = getDb()
  
  // Check if already exists
  const existing = db.prepare('SELECT * FROM dailies WHERE date = ?').get(today)
  if (existing) {
    console.log(`Daily report for ${today} already exists, skipping...`)
    return
  }
  
  // Create daily
  const result = db.prepare(`
    INSERT INTO dailies (date, news_count) VALUES (?, ?)
  `).run(today, processedItems.length)
  
  const dailyId = result.lastInsertRowid
  
  // Insert news
  const insert = db.prepare(`
    INSERT INTO news (daily_id, title, summary, comment, source, category, rating, url, is_top)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  
  for (const item of processedItems) {
    insert.run(
      dailyId,
      item.title,
      item.summary,
      item.comment,
      item.source,
      item.category,
      item.rating,
      item.url,
      item.isTop ? 1 : 0
    )
  }
  
  console.log(`✅ Daily report generated: ${today} (${processedItems.length} items)`)
  
  // Send notification
  await sendPushNotification(processedItems)
}

async function sendPushNotification(news) {
  // This would integrate with WeChat/WhatsApp push
  console.log(`📤 Would send push notification with ${news.length} items`)
}
