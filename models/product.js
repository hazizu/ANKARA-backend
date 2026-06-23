const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: [true, 'Le prix est obligatoire'],
    min: 0,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Référence vers la collection
  productCollection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    required: [true, 'La collection est obligatoire'],
  },
  category: {
    type: String,
    required: [true, 'La catégorie est obligatoire'],
    trim: true,
    // Optionnel : restreindre à des valeurs précises
    // enum: ['hommes', 'femmes', 'enfants', 'accessoires'],
  },
  images: [String],   // tableau d'URLs ou de chemins
  sizes: [String],   // table de tailles du produit 
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });   // createdAt + updatedAt automatiques

module.exports = mongoose.model('Product', productSchema);