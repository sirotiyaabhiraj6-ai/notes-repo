-- Database schema for the Notes app (SQLite).
-- Safe to run repeatedly: db.js executes this file on every server start.

CREATE TABLE IF NOT EXISTS notes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL
             CHECK (length(trim(title)) > 0 AND length(title) <= 100),
  content    TEXT NOT NULL
             CHECK (length(trim(content)) > 0 AND length(content) <= 5000),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes (updated_at DESC);
