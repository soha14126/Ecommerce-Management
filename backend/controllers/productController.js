// backend/controllers/productController.js
// Handles all product-related operations

const db = require('../config/db');

// ── GET ALL PRODUCTS (with optional category filter & search) ─────────────────
const getProducts = async (req, res) => {
    try {
        const { category, search, limit = 20, offset = 0 } = req.query;
        let query  = 'SELECT * FROM products WHERE 1=1';
        const params = [];

        if (category && category !== 'All') {
            query += ' AND category = ?';
            params.push(category);
        }

        if (search) {
            query += ' AND (name LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [products] = await db.query(query, params);

        // Count for pagination
        let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
        const countParams = [];
        if (category && category !== 'All') { countQuery += ' AND category = ?'; countParams.push(category); }
        if (search) { countQuery += ' AND (name LIKE ? OR description LIKE ?)'; countParams.push(`%${search}%`, `%${search}%`); }

        const [[{ total }]] = await db.query(countQuery, countParams);

        res.json({ success: true, products, total, limit: parseInt(limit), offset: parseInt(offset) });
    } catch (err) {
        console.error('Get products error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch products.' });
    }
};

// ── GET SINGLE PRODUCT ────────────────────────────────────────────────────────
const getProductById = async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (products.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        res.json({ success: true, product: products[0] });
    } catch (err) {
        console.error('Get product error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch product.' });
    }
};

// ── GET FEATURED PRODUCTS ─────────────────────────────────────────────────────
const getFeaturedProducts = async (req, res) => {
    try {
        const [products] = await db.query(
            'SELECT * FROM products ORDER BY rating DESC LIMIT 8'
        );
        res.json({ success: true, products });
    } catch (err) {
        console.error('Get featured error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch featured products.' });
    }
};

// ── GET CATEGORIES ─────────────────────────────────────────────────────────────
const getCategories = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT category, COUNT(*) as count FROM products GROUP BY category'
        );
        res.json({ success: true, categories: rows });
    } catch (err) {
        console.error('Get categories error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
    }
};

module.exports = { getProducts, getProductById, getFeaturedProducts, getCategories };
