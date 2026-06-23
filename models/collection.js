const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    default: '',
  },
  images: [String],   // tableau d'URLs ou de chemins
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Génère le slug automatiquement depuis le name
collectionSchema.pre('save', async function () {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
});



module.exports = mongoose.model('Collection', collectionSchema);