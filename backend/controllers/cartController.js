// backend/controllers/cartController.js
// Cart CRUD operations

const db = require('../config/db');

// ── GET CART ──────────────────────────────────────────────────────────────────
const getCart = async (req, res) => {
    try {
        const [items] = await db.query(
            `SELECT c.id, c.quantity, c.product_id,
                    p.name, p.price, p.image, p.category, p.stock
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ?`,
            [req.user.id]
        );

        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        res.json({ success: true, items, total: parseFloat(total.toFixed(2)) });
    } catch (err) {
        console.error('Get cart error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch cart.' });
    }
};

// ── ADD TO CART ───────────────────────────────────────────────────────────────
const addToCart = async (req, res) => {
    try {
        const { product_id, quantity = 1 } = req.body;

        if (!product_id) {
            return res.status(400).json({ success: false, message: 'Product ID is required.' });
        }

        // Check product exists
        const [products] = await db.query('SELECT id, stock FROM products WHERE id = ?', [product_id]);
        if (products.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        // Upsert: if already in cart, increase quantity
        await db.query(
            `INSERT INTO cart (user_id, product_id, quantity)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
            [req.user.id, product_id, quantity]
        );

        res.json({ success: true, message: 'Product added to cart.' });
    } catch (err) {
        console.error('Add to cart error:', err);
        res.status(500).json({ success: false, message: 'Failed to add to cart.' });
    }
};

// ── UPDATE QUANTITY ───────────────────────────────────────────────────────────
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartId = req.params.id;

        if (quantity < 1) {
            return res.status(400).json({ success: false, message: 'Quantity must be at least 1.' });
        }

        const [result] = await db.query(
            'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
            [quantity, cartId, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Cart item not found.' });
        }

        res.json({ success: true, message: 'Cart updated.' });
    } catch (err) {
        console.error('Update cart error:', err);
        res.status(500).json({ success: false, message: 'Failed to update cart.' });
    }
};

// ── REMOVE FROM CART ──────────────────────────────────────────────────────────
const removeFromCart = async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM cart WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Cart item not found.' });
        }

        res.json({ success: true, message: 'Item removed from cart.' });
    } catch (err) {
        console.error('Remove from cart error:', err);
        res.status(500).json({ success: false, message: 'Failed to remove item.' });
    }
};

// ── CLEAR CART ────────────────────────────────────────────────────────────────
const clearCart = async (req, res) => {
    try {
        await db.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
        res.json({ success: true, message: 'Cart cleared.' });
    } catch (err) {
        console.error('Clear cart error:', err);
        res.status(500).json({ success: false, message: 'Failed to clear cart.' });
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
