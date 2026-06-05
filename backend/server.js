require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
});

const db = admin.firestore();
const auth = admin.auth();
const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Set custom admin claim on a user (admin-only operation)
app.post('/api/admin/set-admin-claim', async (req, res) => {
  const { userId, admin: isAdmin } = req.body;

  if (!userId || typeof isAdmin !== 'boolean') {
    return res.status(400).json({ error: 'Missing or invalid userId or admin flag' });
  }

  try {
    // Verify the requester is an admin
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const idToken = authHeader.slice(7);
    const decodedToken = await auth.verifyIdToken(idToken);

    if (!decodedToken.admin) {
      return res.status(403).json({ error: 'Only admins can set admin claims' });
    }

    // Set custom claim
    await auth.setCustomUserClaims(userId, { admin: isAdmin });
    res.json({ message: `Admin claim set to ${isAdmin} for user ${userId}` });
  } catch (err) {
    console.error('Error setting custom claim:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new product (admin-only)
app.post('/api/admin/products', async (req, res) => {
  const { id, name, description, price, gramatura, complexity, productionTime, image } = req.body;

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const idToken = authHeader.slice(7);
    const decodedToken = await auth.verifyIdToken(idToken);

    if (!decodedToken.admin) {
      return res.status(403).json({ error: 'Only admins can create products' });
    }

    if (!id || !name || !description || typeof price !== 'number') {
      return res.status(400).json({ error: 'Missing or invalid product fields' });
    }

    // Create or update product
    const productRef = db.collection('products').doc(id);
    await productRef.set({
      id,
      name,
      description,
      price,
      gramatura: gramatura || 'N/A',
      complexity: complexity || 'N/A',
      productionTime: productionTime || 'A definir',
      image: image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date(),
    });

    res.json({ message: 'Product created/updated successfully', productId: id });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const snapshot = await db.collection('products').get();
    const products = [];
    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all orders (admin-only, or user's own orders)
app.get('/api/orders', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const idToken = authHeader.slice(7);
    const decodedToken = await auth.verifyIdToken(idToken);
    const userEmail = decodedToken.email;
    const isAdmin = decodedToken.admin;

    let query = db.collection('orders');
    if (!isAdmin) {
      query = query.where('buyerEmail', '==', userEmail);
    }

    const snapshot = await query.get();
    const orders = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        data.createdAt = data.createdAt.toDate().toISOString();
      }
      orders.push({ id: doc.id, ...data });
    });

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: err.message });
  }
});

// Allow backend to write orders directly (useful for serverless functions)
app.post('/api/admin/orders', async (req, res) => {
  const { id, buyerName, buyerEmail, method, status, total, items, notes } = req.body;

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const idToken = authHeader.slice(7);
    const decodedToken = await auth.verifyIdToken(idToken);

    if (!decodedToken.admin) {
      return res.status(403).json({ error: 'Only admins can create orders via backend' });
    }

    const orderId = id || `order-${Date.now()}`;
    await db.collection('orders').doc(orderId).set({
      buyerName,
      buyerEmail,
      method,
      status,
      total,
      items,
      notes,
      createdAt: new Date(),
    });

    res.json({ message: 'Order created successfully', orderId });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`WR3D backend server running on port ${PORT}`);
});
