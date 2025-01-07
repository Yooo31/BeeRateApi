import { Request, Response } from 'express';
import { initDB } from '../db/db';
import { Beer } from '../types/beer';

// Get all beers
export const getAllBeers = async (req: Request, res: Response): Promise<void> => {
  const db = await initDB();
  const beers: Beer[] = await db.all('SELECT * FROM beers');
  res.json(beers);
};

// Get a beer by ID
export const getBeerById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const db = await initDB();
  const beer: Beer | undefined = await db.get('SELECT * FROM beers WHERE id = ?', req.params.id);
  if (!beer) {
    res.status(404).json({ error: 'Beer not found' });
    return;
  }
  res.json(beer);
};

// Add a new beer
export const addBeer = async (req: Request, res: Response): Promise<void> => {
  const { name, alcohol, price, rating } = req.body;
  const db = await initDB();
  const result = await db.run(
    'INSERT INTO beers (name, alcohol, price, rating) VALUES (?, ?, ?, ?)',
    [name, alcohol, price, rating]
  );
  res.status(201).json({ id: result.lastID });
};

// Upload photo for a beer
export const uploadBeerPhoto = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const db = await initDB();
  const { id } = req.params;

  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const result = await db.run('UPDATE beers SET photo = ? WHERE id = ?', [req.file.path, id]);
  if (result.changes === 0) {
    res.status(404).json({ error: 'Beer not found' });
    return;
  }

  res.json({ message: 'Photo uploaded successfully', filePath: req.file.path });
};

// Update beer
export const updateBeer = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const { name, alcohol, price, rating } = req.body;
  const db = await initDB();
  const result = await db.run(
    'UPDATE beers SET name = ?, alcohol = ?, price = ?, rating = ? WHERE id = ?',
    [name, alcohol, price, rating, req.params.id]
  );

  if (result.changes === 0) {
    res.status(404).json({ error: 'Beer not found' });
    return;
  }

  res.json({ updated: result.changes });
};

// Delete beer
export const deleteBeer = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const db = await initDB();
  const result = await db.run('DELETE FROM beers WHERE id = ?', req.params.id);
  res.json({ deleted: result.changes });
};
