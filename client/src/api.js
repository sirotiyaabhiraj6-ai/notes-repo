// All network code lives here so components stay simple.

async function request(url, options = {}) {
  let res;
  try {
    res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    // fetch only throws when the network/server is unreachable
    throw new Error('Cannot reach the server. Check that it is running.');
  }

  if (!res.ok) {
    // fetch does NOT throw on 4xx/5xx, so we convert them into errors
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

export const getNotes = (search = '') =>
  request(`/api/notes?search=${encodeURIComponent(search)}`);

export const createNote = (data) =>
  request('/api/notes', { method: 'POST', body: JSON.stringify(data) });

export const updateNote = (id, data) =>
  request(`/api/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteNote = (id) =>
  request(`/api/notes/${id}`, { method: 'DELETE' });
