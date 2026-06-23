const Collection = require('../models/collection');
const Product = require('../models/product');

// Créer une collection
exports.createCollection = async (req, res) => {
  try {
    // Récupère l'URL Cloudinary uploadée par multer
    const image = req.files ? req.files.image.path : null;

    const collection = await Collection.create({
      ...req.body,
      image,
    });
    res.status(201).json({ success: true, data: collection });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Lister toutes les collections
exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });
    res.json({ success: true, count: collections.length, data: collections });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Récupérer une collection + ses produits (par ID ou slug)
exports.getCollection = async (req, res) => {
  try {
    const filter = mongoose.Types.ObjectId.isValid(req.params.ref)
      ? { _id: req.params.ref }
      : { slug: req.params.ref };

    const collection = await Collection.findOne(filter);
    if (!collection)
      return res.status(404).json({ success: false, message: 'Collection introuvable' });

    const products = await Product.find({
      collection: collection._id,
      isAvailable: true,
    });

    res.json({ success: true, data: { ...collection.toObject(), products } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Mettre à jour une collection
exports.updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!collection)
      return res.status(404).json({ success: false, message: 'Collection introuvable' });
    res.json({ success: true, data: collection });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Supprimer une collection (vérifie qu'elle est vide)
exports.deleteCollection = async (req, res) => {
  try {
    const productCount = await Product.countDocuments({ collection: req.params.id });
    if (productCount > 0)
      return res.status(400).json({
        success: false,
        message: `Impossible : ${productCount} produit(s) appartiennent à cette collection`,
      });

    await Collection.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Collection supprimée' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};