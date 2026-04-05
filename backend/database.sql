-- ============================================================
-- Online Shopping System — Database Schema & Seed Data
-- ============================================================

CREATE DATABASE IF NOT EXISTS online_shopping;
USE online_shopping;

-- ------------------------------------------------------------
-- 1. USERS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(15),
    address     TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    price       DECIMAL(10,2) NOT NULL,
    image       VARCHAR(500),
    category    ENUM('Electronics','Fashion','Grocery','Furniture','Beauty') NOT NULL,
    description TEXT,
    stock       INT DEFAULT 100,
    rating      DECIMAL(3,1) DEFAULT 4.0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 3. CART TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cart (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    product_id  INT NOT NULL,
    quantity    INT NOT NULL DEFAULT 1,
    added_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_item (user_id, product_id)
);

-- ------------------------------------------------------------
-- 4. ORDERS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    total_price     DECIMAL(10,2) NOT NULL,
    status          ENUM('Pending','Processing','Shipped','Delivered','Cancelled') DEFAULT 'Pending',
    shipping_name   VARCHAR(100),
    shipping_address TEXT,
    shipping_phone  VARCHAR(15),
    payment_method  ENUM('COD','Credit Card','Debit Card','UPI') DEFAULT 'COD',
    order_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 5. ORDER ITEMS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    order_id    INT NOT NULL,
    product_id  INT NOT NULL,
    quantity    INT NOT NULL,
    price       DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================================
-- SEED DATA — Products
-- ============================================================
INSERT INTO products (name, price, image, category, description, stock, rating) VALUES

-- Electronics
('Samsung Galaxy S23 Ultra', 89999.00, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400', 'Electronics', 'Flagship smartphone with 200MP camera, S-Pen, and 5000mAh battery. Enjoy stunning Dynamic AMOLED display.', 50, 4.8),
('Apple MacBook Air M2', 114999.00, 'https://images.unsplash.com/photo-1611186871525-6dc8e47bb4f7?w=400', 'Electronics', 'Supercharged by the Apple M2 chip. Strikingly thin design with MagSafe charging and 18-hour battery life.', 30, 4.9),
('Sony WH-1000XM5 Headphones', 27999.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 'Electronics', 'Industry-leading noise cancellation with crystal-clear hands-free calling and up to 30 hours battery.', 80, 4.7),
('Dell 27" 4K Monitor', 34999.00, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', 'Electronics', 'UltraSharp 4K USB-C monitor with 99% sRGB color coverage, perfect for creative professionals.', 40, 4.6),
('Logitech MX Master 3 Mouse', 8999.00, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400', 'Electronics', 'Advanced wireless mouse with ultra-fast MagSpeed scrolling and ergonomic design for all-day comfort.', 120, 4.7),

-- Fashion
('Nike Air Max 270', 12999.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'Fashion', 'Iconic Nike Air Max cushioning technology delivers unrivaled comfort with bold, head-turning style.', 200, 4.5),
('Levi''s 501 Original Jeans', 4999.00, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 'Fashion', 'The original straight fit jean. Made from 100% cotton denim with iconic button fly and 5-pocket styling.', 300, 4.4),
('Premium Cotton Kurta Set', 2499.00, 'https://images.unsplash.com/photo-1594938298603-c8148c4b984b?w=400', 'Fashion', 'Elegant ethnic wear crafted from breathable premium cotton. Perfect for festive occasions and casual outings.', 150, 4.3),
('Ray-Ban Aviator Sunglasses', 6999.00, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', 'Fashion', 'Classic aviator style with UV400 protection lenses. Timeless design that never goes out of fashion.', 90, 4.6),
('Fossil Gen 6 Smartwatch', 18999.00, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 'Fashion', 'Stay connected in style. Features Wear OS, heart rate monitoring, GPS, and 24-hour battery life.', 60, 4.5),

-- Grocery
('Organic Almonds 500g', 699.00, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', 'Grocery', 'Premium quality California almonds, rich in protein, healthy fats, and essential vitamins. 100% natural.', 500, 4.6),
('Cold Pressed Olive Oil 1L', 899.00, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', 'Grocery', 'Extra virgin cold-pressed olive oil. Perfect for cooking, salads, and skin care. Rich in antioxidants.', 400, 4.5),
('Himalayan Pink Salt 1kg', 299.00, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400', 'Grocery', 'Pure natural pink salt from the Himalayas. Rich in 84+ minerals. Perfect for everyday cooking and seasoning.', 600, 4.4),
('Green Tea 100 Bags', 399.00, 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400', 'Grocery', 'Premium Darjeeling green tea bags. Rich in antioxidants, boosts metabolism and promotes relaxation.', 350, 4.7),
('Mixed Dry Fruits Box 250g', 549.00, 'https://images.unsplash.com/photo-1599599811080-7f51cca9fc10?w=400', 'Grocery', 'Premium assortment of cashews, walnuts, pistachios, and raisins. Nutritious and delicious healthy snack.', 450, 4.5),

-- Furniture
('Ergonomic Office Chair', 15999.00, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', 'Furniture', 'Premium mesh back ergonomic chair with lumbar support, adjustable armrests, and 3D headrest for long work hours.', 25, 4.6),
('Solid Wood Study Table', 12499.00, 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400', 'Furniture', 'Crafted from premium sheesham wood. Features spacious desktop, built-in shelf, and cable management hole.', 20, 4.5),
('3-Seater Fabric Sofa', 34999.00, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', 'Furniture', 'Modern 3-seater sofa with premium fabric upholstery and foam cushions. Perfect for living room elegance.', 15, 4.4),
('Minimalist Bookshelf', 7999.00, 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400', 'Furniture', '5-tier industrial bookshelf with metal frame and wooden shelves. Holds up to 50kg. Easy to assemble.', 35, 4.3),
('King Size Platform Bed', 29999.00, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400', 'Furniture', 'Solid wood king size bed with hydraulic storage box. Elegant headboard design with premium finish.', 10, 4.7),

-- Beauty
('Lakme 9to5 Foundation', 599.00, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400', 'Beauty', 'Lightweight, buildable coverage foundation with SPF 35. Provides 16-hour wear with natural matte finish.', 250, 4.4),
('Biotique Bio Sunscreen SPF 50', 349.00, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400', 'Beauty', 'Natural botanical sunscreen with SPF 50 protection. Non-greasy, water-resistant formula for all skin types.', 300, 4.3),
('The Body Shop Shea Butter', 1299.00, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', 'Beauty', 'Intensely moisturizing body butter with 100% community fair trade shea butter. Leaves skin feeling silky.', 180, 4.6),
('Maybelline Lip Color Kit', 799.00, 'https://images.unsplash.com/photo-1586495777744-4e6232bf2253?w=400', 'Beauty', 'Long-lasting liquid lip color with 12-hour wear formula. Comes with 6 trendy shades for every occasion.', 220, 4.5),
('Vitamin C Serum 30ml', 999.00, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400', 'Beauty', '20% Vitamin C + Hyaluronic Acid serum. Brightens skin, reduces dark spots and boosts collagen production.', 200, 4.7);
