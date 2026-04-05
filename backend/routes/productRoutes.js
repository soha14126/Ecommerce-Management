// backend/routes/productRoutes.js
const express = require('express');
const router  = express.Router();
const { getProducts, getProductById, getFeaturedProducts, getCategories } = require('../controllers/productController');

router.get('/',            getProducts);
router.get('/featured',    getFeaturedProducts);
router.get('/categories',  getCategories);
router.get('/:id',         getProductById);

module.exports = router;
