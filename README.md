<<<<<<< HEAD
# Notes App

A full-stack notes application with create, edit, search and delete.
Built for the CodeNova Full Stack Development internship (Task 1).

## Features

- Create, view, edit and delete notes
- Search by title and content with a 300 ms debounce and highlighted matches
- Responsive card grid (1 column on phones, several on desktop)
- Client-side and server-side validation (title <= 100 chars, content <= 5000 chars)
- Toast notifications for success and for network or server errors
- Loading, empty and error states with a retry button
- Data persists in SQLite, so notes survive server restarts

## Tech stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, Vite, react-hot-toast         |
| Backend  | Node.js, Express 4                      |
| Database | SQLite via better-sqlite3 (no server needed) |

## Architecture

```
Browser (React) --fetch /api/*--> Express --SQL--> SQLite (server/notes.db)
```

The database is the source of truth. After every create, update or delete the
client re-fetches the list, so the UI always matches the stored data. Stale
search responses are ignored, so fast typing never shows out-of-date results.

```
notes-app/
├── client/                 React app
│   └── src/
│       ├── api.js          all fetch calls and error handling
│       ├── App.jsx         state and data flow
│       ├── components/     NoteForm, NoteCard
│       └── hooks/          useDebounce
├── server/                 Express API
│   ├── index.js            app setup, error handling
│   ├── routes/notes.js     CRUD routes and validation
│   ├── db.js               connection, runs schema.sql
│   ├── schema.sql          database schema
│   └── seed.js             sample data (optional)
└── package.json            helper scripts
```

## Setup

Requirements: Node.js 18 or newer.

```bash
# 1. install everything
npm run setup

# 2. (optional) add sample notes
npm run seed

# 3. start server (port 5000) and client (port 5173) together
npm run dev
```

Open http://localhost:5173.

To run the pieces separately:

```bash
cd server && npm install && npm start      # API on :5000
cd client && npm install && npm run dev    # UI on :5173
```

Production-style run (Express serves the built React app on :5000):

```bash
npm run build && npm start
```

## API

Base URL: `/api`

| Method | Route               | Description                         | Success | Errors        |
|--------|---------------------|-------------------------------------|---------|---------------|
| GET    | `/notes?search=abc` | List notes, filtered by title/content | 200   | 500           |
| GET    | `/notes/:id`        | Get one note                        | 200     | 400, 404      |
| POST   | `/notes`            | Create a note `{ title, content }`  | 201     | 400           |
| PUT    | `/notes/:id`        | Update a note `{ title, content }`  | 200     | 400, 404      |
| DELETE | `/notes/:id`        | Delete a note                       | 204     | 400, 404      |
| GET    | `/health`           | Health check                        | 200     |               |

Errors always return JSON: `{ "message": "Title is required" }`.

## Database schema

```sql
CREATE TABLE notes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL CHECK (length(trim(title)) > 0 AND length(title) <= 100),
  content    TEXT NOT NULL CHECK (length(trim(content)) > 0 AND length(content) <= 5000),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
```

The full script is in `server/schema.sql` and runs automatically on server start.

## Quick API test

```bash
curl -X POST localhost:5000/api/notes -H "Content-Type: application/json" \
     -d '{"title":"Hello","content":"First note"}'
curl "localhost:5000/api/notes?search=first"
curl -X POST localhost:5000/api/notes -H "Content-Type: application/json" -d '{"title":""}'   # 400
```

## Screenshots

Add your screenshots to `docs/` and link them here:

1. Main view with notes (desktop)
2. Search with highlighted results
3. Error toast (stop the server and try to add a note)
4. Mobile view

![Main view](docs/main.png)

## Author

Your name - CodeNova Internship, Batch 01
=======
# notes-repo
full stack development
>>>>>>> 8aeeaca9f5fcb81dc4fa3e1586ef957c6b122ee2
