import { useCallback, useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { getNotes, createNote, updateNote, deleteNote } from './api';
import useDebounce from './hooks/useDebounce';
import NoteForm from './components/NoteForm';
import NoteCard from './components/NoteCard';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // note being edited, or null
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const debouncedSearch = useDebounce(search.trim(), 300);
  const requestId = useRef(0);

  // The database is the source of truth: we always re-fetch after a change.
  const loadNotes = useCallback(async (term) => {
    const id = ++requestId.current;
    try {
      const data = await getNotes(term);
      if (id !== requestId.current) return; // a newer request superseded this one
      setNotes(data);
      setLoadError('');
    } catch (err) {
      if (id !== requestId.current) return;
      setLoadError(err.message);
      toast.error(err.message, { id: 'load-error' });
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes(debouncedSearch);
  }, [debouncedSearch, loadNotes]);

  // Resolves true on success so the form knows whether to clear itself.
  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateNote(editing.id, data);
        toast.success('Note saved');
        setEditing(null);
      } else {
        await createNote(data);
        toast.success('Note added');
      }
      await loadNotes(debouncedSearch);
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const handleEdit = (note) => {
    setEditing(note);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (note) => {
    if (!window.confirm(`Delete "${note.title}"? This cannot be undone.`)) return;
    try {
      await deleteNote(note.id);
      toast.success('Note deleted');
      if (editing?.id === note.id) setEditing(null);
      await loadNotes(debouncedSearch);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="page">
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />

      <header className="masthead">
        <h1>Notes</h1>
        <p>{notes.length} {notes.length === 1 ? 'note' : 'notes'}{debouncedSearch && ` matching “${debouncedSearch}”`}</p>
      </header>

      <main className="layout">
        <aside className="layout__form">
          <NoteForm
            key={editing ? editing.id : 'new'}
            editing={editing}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
          />
        </aside>

        <section className="layout__list" aria-label="Your notes">
          <input
            type="search"
            className="search"
            placeholder="Search by title or content"
            aria-label="Search notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading && <p className="state">Loading notes…</p>}

          {!loading && loadError && (
            <div className="state state--error" role="alert">
              <p>{loadError}</p>
              <button className="btn" onClick={() => loadNotes(debouncedSearch)}>Try again</button>
            </div>
          )}

          {!loading && !loadError && notes.length === 0 && (
            <p className="state">
              {debouncedSearch
                ? 'No notes match that search. Try a different word.'
                : 'No notes yet. Add your first note using the form.'}
            </p>
          )}

          <div className="grid">
            {notes.map((n) => (
              <NoteCard
                key={n.id}
                note={n}
                term={debouncedSearch}
                isEditing={editing?.id === n.id}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
