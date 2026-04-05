// backend/routes/cartRoutes.js
const express = require('express');
const router  = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');

// All cart routes require login
router.use(authenticateToken);

router.get('/',          getCart);
router.post('/',         addToCart);
router.put('/:id',       updateCartItem);
router.delete('/clear',  clearCart);
router.delete('/:id',    removeFromCart);

module.exports = router;
