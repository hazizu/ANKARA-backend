const express = require('express');
const router = express.Router();
const {upload }= require('../config/cloudinary')
const {
  createCollection,
  getCollections,
  getCollection,
  updateCollection,
  deleteCollection,
} = require('../controllers/collectionController');

router.get('/', getCollections);

router.route('/').get(getCollections)
.post(upload.array('images', 5), createCollection); 

router.route('/:id').get(getCollection)
.put(upload.array('images', 5), updateCollection)
.delete(deleteCollection);
 
          // accepte ID ou slug


module.exports = router;