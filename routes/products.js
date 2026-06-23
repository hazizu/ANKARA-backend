const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const {
  createProduct,
  getProductsByCollection,
  getProductsByCategory,
  getProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} = require('../controllers/productController');

router.get('/categories', getCategories);
router.route('/by-category').get(getProductsByCategory);
router.route('/by-collection').get(getProductsByCollection);

router.route('/')
.get(getProductsByCollection)
.post(upload.array('images', 5), createProduct);


router.route('/:id')
.get(getProduct)
.put(upload.array('images', 5),updateProduct)
.delete(deleteProduct);

module.exports = router;