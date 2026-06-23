const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/products');
const collectionRoutes = require('./routes/collections');


const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/collections', collectionRoutes);


 
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connecté');
    app.listen(process.env.PORT || 3000, () =>
      console.log(`Serveur lancé sur le port ${process.env.PORT || 3000}`)
    );
  })
  .catch(err => console.error('Erreur MongoDB :', err));  