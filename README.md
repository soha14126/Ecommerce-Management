# 🛍️ ShopEasy — Online Shopping System

A complete full-stack e-commerce web application built with:
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js + Express.js
- **Database**: MySQL

---

## 📁 Project Structure

```
online/
├── backend/
│   ├── config/db.js            ← MySQL connection
│   ├── controllers/            ← Business logic
│   ├── middleware/auth.js      ← JWT middleware
│   ├── routes/                 ← API routes
│   ├── database.sql            ← Schema + seed data
│   ├── server.js               ← Entry point
│   └── .env                    ← Config values
└── frontend/
    ├── index.html              ← Home page
    ├── login.html              ← Login
    ├── signup.html             ← Register
    ├── products.html           ← Product listing
    ├── product-detail.html     ← Product detail
    ├── cart.html               ← Shopping cart
    ├── checkout.html           ← Checkout
    ├── orders.html             ← Order history
    ├── css/style.css           ← Global styles
    └── js/api.js               ← API helper
```

---

## 🚀 Setup Instructions

### Step 1: Setup MySQL Database

1. Open **MySQL Workbench** or **phpMyAdmin** or command line
2. Import the database:
   ```sql
   source C:/Users/Ansar shaikh/OneDrive/Desktop/online/backend/database.sql
   ```
   Or copy-paste the contents of `database.sql` and execute it.

### Step 2: Configure Environment

Edit `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password   ← Change this!
DB_NAME=online_shopping
JWT_SECRET=onlineshop_super_secret_key_2024
PORT=5000
```

### Step 3: Install & Run Backend

```bash
cd backend
npm install
npm start
```

The server will start at: **http://localhost:5000**

### Step 4: Open Frontend

Open `frontend/index.html` in your browser, **OR** use Live Server extension in VS Code.

The frontend automatically connects to the backend at `http://localhost:5000`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/profile` | Get profile | ✅ Yes |
| GET | `/api/products` | List products | No |
| GET | `/api/products/featured` | Featured | No |
| GET | `/api/products/:id` | Single product | No |
| GET | `/api/cart` | View cart | ✅ Yes |
| POST | `/api/cart` | Add to cart | ✅ Yes |
| PUT | `/api/cart/:id` | Update qty | ✅ Yes |
| DELETE | `/api/cart/:id` | Remove item | ✅ Yes |
| POST | `/api/orders` | Place order | ✅ Yes |
| GET | `/api/orders` | Order history | ✅ Yes |

---

## 🗄️ Database Tables

- **users** — id, name, email, password (bcrypt), phone, address
- **products** — id, name, price, image, category, description, stock, rating
- **cart** — id, user_id, product_id, quantity
- **orders** — id, user_id, total_price, status, shipping details
- **order_items** — id, order_id, product_id, quantity, price

---

## 🎨 Features

- ✅ Modern responsive design (white & blue theme)
- ✅ JWT-based user authentication
- ✅ Password hashing with bcrypt
- ✅ Product listing with category filter & search
- ✅ Shopping cart with quantity controls
- ✅ Checkout with multiple payment options
- ✅ Order history with status tracking
- ✅ Toast notifications
- ✅ Skeleton loading animations
- ✅ Mobile responsive navbar

---

## 💡 Troubleshooting

**Server won't start?**
- Make sure MySQL is running
- Check DB_PASSWORD in `.env`
- Run `npm install` in `backend/` folder

**Products not loading?**
- Make sure the database is seeded (`database.sql` executed)
- Check browser console for errors
- Verify server is running on port 5000
