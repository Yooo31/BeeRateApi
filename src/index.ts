import cors from 'cors';
import express from 'express';
import {
  addBeerWithPhoto,
  deleteBeer,
  getAllBeers,
  getBeerById,
  updateBeer
} from './controllers/beerController';
import { upload } from './middlewares/upload';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.get('/beers', getAllBeers);
app.get('/beers/:id', getBeerById);
app.post('/add/beer', upload.single('photo'), addBeerWithPhoto);
app.put('/beers/:id', updateBeer);
app.delete('/beers/:id', deleteBeer);

// Start server
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
