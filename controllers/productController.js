const Product = require('../models/product');

// Créer un produit
exports.createProduct = async (req, res) => {
  try {
    // Récupère les URLs Cloudinary uploadées par multer
    const images = req.files ? req.files.map(file => file.path) : [];

    const product = await (await Product.create({
      ...req.body,
      images,
    })).populate('productCollection');
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Lister tous les produits (avec filtre catégorie optionnel)
exports.getProductsByCategory = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const products = await Product.find(filter)
    .populate('productCollection', 'name slug')
    .sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lister tous les produits (avec filtre collection optionnel)
exports.getProductsByCollection = async (req, res) => {
  try {
    const filter = {};
    if (req.query.productCollection) {
      filter.productCollection = req.query.productCollection;
    }

    console.log('filter:', filter); // 👈 ajoute ce log pour vérifier

    const products = await Product.find(filter)
      .populate('productCollection', 'name slug')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Récupérer un produit par son ID
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('productCollection', 'name slug');

    if (!product)
      return res.status(404).json({ success: false, message: 'Produit introuvable' });

    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable' });
    res.json({ success: true, message: 'Produit supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lister les catégories distinctes
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};