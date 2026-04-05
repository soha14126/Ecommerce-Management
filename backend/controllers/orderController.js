// backend/controllers/orderController.js
// Handles order placement and order history

const db = require('../config/db');

// ── PLACE ORDER ───────────────────────────────────────────────────────────────
const placeOrder = async (req, res) => {
    const conn = await db.getConnection();
    try {
        const { shipping_name, shipping_address, shipping_phone, payment_method } = req.body;

        if (!shipping_name || !shipping_address || !shipping_phone) {
            return res.status(400).json({ success: false, message: 'Shipping details are required.' });
        }

        // Get cart items
        const [cartItems] = await conn.query(
            `SELECT c.product_id, c.quantity, p.price, p.stock, p.name
             FROM cart c JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ?`,
            [req.user.id]
        );

        if (cartItems.length === 0) {
            return res.status(400).json({ success: false, message: 'Your cart is empty.' });
        }

        // Calculate total
        const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await conn.beginTransaction();

        // Create order
        const [orderResult] = await conn.query(
            `INSERT INTO orders (user_id, total_price, shipping_name, shipping_address, shipping_phone, payment_method)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.id, totalPrice.toFixed(2), shipping_name, shipping_address, shipping_phone, payment_method || 'COD']
        );

        const orderId = orderResult.insertId;

        // Insert order items
        const orderItems = cartItems.map(item => [orderId, item.product_id, item.quantity, item.price]);
        await conn.query(
            'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?',
            [orderItems]
        );

        // Clear user cart
        await conn.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

        await conn.commit();
        conn.release();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            orderId,
            totalPrice: parseFloat(totalPrice.toFixed(2))
        });
    } catch (err) {
        await conn.rollback();
        conn.release();
        console.error('Place order error:', err);
        res.status(500).json({ success: false, message: 'Failed to place order.' });
    }
};

// ── GET ORDER HISTORY ─────────────────────────────────────────────────────────
const getOrders = async (req, res) => {
    try {
        const [orders] = await db.query(
            `SELECT o.id, o.total_price, o.status, o.payment_method,
                    o.shipping_name, o.shipping_address, o.order_date
             FROM orders o
             WHERE o.user_id = ?
             ORDER BY o.order_date DESC`,
            [req.user.id]
        );

        // Get items for each order
        for (const order of orders) {
            const [items] = await db.query(
                `SELECT oi.quantity, oi.price, p.name, p.image
                 FROM order_items oi JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = ?`,
                [order.id]
            );
            order.items = items;
        }

        res.json({ success: true, orders });
    } catch (err) {
        console.error('Get orders error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
    }
};

// ── GET SINGLE ORDER ──────────────────────────────────────────────────────────
const getOrderById = async (req, res) => {
    try {
        const [orders] = await db.query(
            'SELECT * FROM orders WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        const order = orders[0];
        const [items] = await db.query(
            `SELECT oi.quantity, oi.price, p.name, p.image, p.category
             FROM order_items oi JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [order.id]
        );

        order.items = items;
        res.json({ success: true, order });
    } catch (err) {
        console.error('Get order error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch order.' });
    }
};

module.exports = { placeOrder, getOrders, getOrderById };
