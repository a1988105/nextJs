import bcrypt from 'bcryptjs'
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.resolve(__dirname, '../dev.db')

const db = new Database(dbPath)

const USERNAME = 'admin'
const PASSWORD = 'password123'

const hash = await bcrypt.hash(PASSWORD, 10)

const stmt = db.prepare(
  'INSERT INTO User (username, password) VALUES (?, ?) ON CONFLICT(username) DO UPDATE SET password = ?'
)
const result = stmt.run(USERNAME, hash, hash)

console.log(`✓ 用戶建立成功：${USERNAME}，密碼：${PASSWORD}`)
db.close()
