// Wraps matches of `term` in <mark> so search results are easy to spot.
function Highlight({ text, term }) {
  if (!term) return text;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === term.toLowerCase() ? <mark key={i}>{part}</mark> : part
  );
}

const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default function NoteCard({ note, term, isEditing, onEdit, onDelete }) {
  const edited = note.updated_at !== note.created_at;
  return (
    <article className={`card${isEditing ? ' card--editing' : ''}`}>
      <h3 className="card__title"><Highlight text={note.title} term={term} /></h3>
      <p className="card__body"><Highlight text={note.content} term={term} /></p>
      <footer className="card__footer">
        <time dateTime={note.updated_at}>
          {edited ? 'Edited ' : 'Created '}{formatDate(note.updated_at)}
        </time>
        <div className="card__actions">
          <button className="btn btn--small" onClick={() => onEdit(note)}>Edit</button>
          <button className="btn btn--small btn--danger" onClick={() => onDelete(note)}>Delete</button>
        </div>
      </footer>
    </article>
  );
}
