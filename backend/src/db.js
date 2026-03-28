import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '..', 'data', 'ai-daily.db')

let db = null

export function initDatabase() {
  // Ensure data directory exists
  const dataDir = path.join(__dirname, '..', 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  db = new Database(dbPath)
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS dailies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE NOT NULL,
      news_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      daily_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      summary TEXT,
      comment TEXT,
      source TEXT,
      category TEXT,
      rating INTEGER DEFAULT 3,
      url TEXT,
      is_top INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (daily_id) REFERENCES dailies(id)
    );
    
    CREATE TABLE IF NOT EXISTS sources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      type TEXT DEFAULT 'rss',
      enabled INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_news_daily ON news(daily_id);
    CREATE INDEX IF NOT EXISTS idx_news_title ON news(title);
    CREATE INDEX IF NOT EXISTS idx_dailies_date ON dailies(date);
  `)
  
  // Insert default sources if empty
  const count = db.prepare('SELECT COUNT(*) as count FROM sources').get()
  if (count.count === 0) {
    const insertSource = db.prepare(`
      INSERT INTO sources (name, url, type) VALUES (?, ?, ?)
    `)
    
    const defaultSources = [
      ['虎嗅', 'https://www.huxiu.com/rss/0.xml', 'rss'],
      ['爱范儿', 'https://www.ifanr.com/feed', 'rss'],
      ['钛媒体', 'https://www.tmtpost.com/rss', 'rss'],
      ['少数派', 'https://sspai.com/rss', 'rss'],
      ['Solidot', 'https://www.solidot.org/index.rss', 'rss'],
      ['36kr', 'https://36kr.com/feed', 'rss']
    ]
    
    for (const source of defaultSources) {
      insertSource.run(...source)
    }
  }
  
  console.log('✅ Database initialized')
  return db
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized')
  }
  return db
}
