import { useState } from 'react';

const MAX_TITLE = 100;
const MAX_CONTENT = 5000;

// Used for both creating and editing. Pass `key={note?.id}` from the parent
// so the form resets when you switch between notes.
export default function NoteForm({ editing, onSubmit, onCancel }) {
  const [title, setTitle] = useState(editing?.title ?? '');
  const [content, setContent] = useState(editing?.content ?? '');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = 'Add a title.';
    else if (title.length > MAX_TITLE) e.title = `Keep the title under ${MAX_TITLE} characters.`;
    if (!content.trim()) e.content = 'Write something in the note.';
    else if (content.length > MAX_CONTENT) e.content = `Keep the note under ${MAX_CONTENT} characters.`;
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setSaving(true);
    const ok = await onSubmit({ title: title.trim(), content: content.trim() });
    setSaving(false);
    if (ok && !editing) {
      setTitle('');
      setContent('');
    }
  };

  return (
    <form className="composer" onSubmit={handleSubmit} noValidate>
      <h2 className="composer__heading">{editing ? 'Edit note' : 'New note'}</h2>

      <label className="field">
        <span className="field__label">Title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What is this note about?"
          maxLength={MAX_TITLE + 20}
          aria-invalid={!!errors.title}
        />
        {errors.title && <span className="field__error" role="alert">{errors.title}</span>}
      </label>

      <label className="field">
        <span className="field__label">Note</span>
        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here"
          aria-invalid={!!errors.content}
        />
        {errors.content && <span className="field__error" role="alert">{errors.content}</span>}
      </label>

      <div className="composer__actions">
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Add note'}
        </button>
        {editing && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
