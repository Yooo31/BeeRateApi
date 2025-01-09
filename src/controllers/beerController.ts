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
export const addBeerWithPhoto = async (req: Request, res: Response): Promise<void> => {
  const db = await initDB();

  const { name, alcohol, price, rating } = req.body;

  if (!name || !alcohol || !rating) {
    res.status(400).json({ error: 'Les champs name, alcohol et rating sont obligatoires.' });
    return;
  }

  try {
    const result = await db.run(
      'INSERT INTO beers (name, alcohol, price, rating, photo) VALUES (?, ?, ?, ?, ?)',
      [
        name,
        alcohol,
        price || null,
        parseFloat(rating),
        req.file ? req.file.path : null,
      ]
    );

    res.status(201).json({
      id: result.lastID,
      name,
      alcohol,
      price: price || null,
      rating: parseFloat(rating),
      photo: req.file ? req.file.path : null,
    });
  } catch (error) {
    console.error('Erreur lors de l’ajout de la bière :', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
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
