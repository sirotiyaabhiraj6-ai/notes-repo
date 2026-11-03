import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.join(__dirname, 'notes.db');

const db = new Database(dbPath); // creates the file if it does not exist
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables on startup (idempotent)
db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

export default db;
