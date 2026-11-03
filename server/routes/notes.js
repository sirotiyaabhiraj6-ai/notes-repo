import { Router } from 'express';
import db from '../db.js';

const router = Router();

const MAX_TITLE = 100;
const MAX_CONTENT = 5000;

// Prepared statements are compiled once and reused (faster and injection-safe)
const stmts = {
  list: db.prepare(`
    SELECT * FROM notes
    WHERE title LIKE @term ESCAPE '\\' OR content LIKE @term ESCAPE '\\'
    ORDER BY updated_at DESC, id DESC
  `),
  get: db.prepare('SELECT * FROM notes WHERE id = ?'),
  insert: db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)'),
  update: db.prepare(`
    UPDATE notes
    SET title = ?, content = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = ?
  `),
  remove: db.prepare('DELETE FROM notes WHERE id = ?'),
};

// Escape LIKE wildcards so searching for "50%" or "a_b" matches literally
const likeTerm = (s) => `%${s.replace(/[\\%_]/g, '\\$&')}%`;

function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ message: 'Invalid note id' });
    return null;
  }
  return id;
}

// Returns { data } on success or { error } on failure
function validate(body = {}) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const content = typeof body.content === 'string' ? body.content.trim() : '';
  if (!title) return { error: 'Title is required' };
  if (!content) return { error: 'Content is required' };
  if (title.length > MAX_TITLE) return { error: `Title must be ${MAX_TITLE} characters or fewer` };
  if (content.length > MAX_CONTENT) return { error: `Content must be ${MAX_CONTENT} characters or fewer` };
  return { data: { title, content } };
}

// GET /api/notes?search=term  -> list, optionally filtered by title/content
router.get('/', (req, res) => {
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  res.json(stmts.list.all({ term: likeTerm(search) }));
});

// GET /api/notes/:id
router.get('/:id', (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const note = stmts.get.get(id);
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
});

// POST /api/notes
router.post('/', (req, res) => {
  const { data, error } = validate(req.body);
  if (error) return res.status(400).json({ message: error });
  const info = stmts.insert.run(data.title, data.content);
  res.status(201).json(stmts.get.get(info.lastInsertRowid));
});

// PUT /api/notes/:id
router.put('/:id', (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const { data, error } = validate(req.body);
  if (error) return res.status(400).json({ message: error });
  const info = stmts.update.run(data.title, data.content, id);
  if (info.changes === 0) return res.status(404).json({ message: 'Note not found' });
  res.json(stmts.get.get(id));
});

// DELETE /api/notes/:id
router.delete('/:id', (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const info = stmts.remove.run(id);
  if (info.changes === 0) return res.status(404).json({ message: 'Note not found' });
  res.status(204).end();
});

export default router;
