import cors from 'cors';
import express from 'express';
import {
  addBeer,
  deleteBeer,
  getAllBeers,
  getBeerById,
  updateBeer,
  uploadBeerPhoto
} from './controllers/beerController';
import { upload } from './middlewares/upload';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/beers', getAllBeers);
app.get('/beers/:id', getBeerById);
app.post('/beers', addBeer);
app.post('/beers/:id/photo', upload.single('photo'), uploadBeerPhoto);
app.put('/beers/:id', updateBeer);
app.delete('/beers/:id', deleteBeer);

// Start server
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
