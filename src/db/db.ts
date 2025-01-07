import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

// Initialize SQLite connection
export const initDB = async () => {
  return open({
    filename: './db/database.sqlite',
    driver: sqlite3.Database,
  });
};
