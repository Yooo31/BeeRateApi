import { initDB } from './db';

const createTable = async () => {
  const db = await initDB();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS beers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      alcohol REAL NOT NULL,
      price REAL NOT NULL,
      rating REAL NOT NULL,
      photo TEXT
    )
  `);
  console.log('Table "beers" created successfully.');
};

createTable().catch((err) => {
  console.error('Error creating table:', err);
});
