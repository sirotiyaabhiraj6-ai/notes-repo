import db from './db.js';

const samples = [
  ['Welcome to Notes', 'Create, edit, search and delete notes. Everything is saved in a SQLite database.'],
  ['Shopping list', 'Milk\nEggs\nBread\nCoffee beans'],
  ['Project ideas', 'Expense tracker\nEvent registration platform\nStudent project showcase'],
  ['Study plan', 'Mon: React hooks\nTue: Express routing\nWed: SQL joins\nThu: Deployment'],
];

const count = db.prepare('SELECT COUNT(*) AS c FROM notes').get().c;
if (count > 0) {
  console.log(`Database already has ${count} notes. Skipping seed.`);
} else {
  const insert = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)');
  db.transaction(() => samples.forEach((s) => insert.run(...s)))();
  console.log(`Seeded ${samples.length} notes.`);
}
