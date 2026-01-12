const express = require('express');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const mongoose = require('mongoose'); // <--- 1. Import Mongoose
const app = express();

app.use(cors());
app.use(express.json());

// 2. CONNECT TO LOCAL DATABASE
// This will automatically create a database named "wefpro" on your laptop
mongoose.connect('mongodb://127.0.0.1:27017/wefpro')
  .then(() => console.log('✅ MongoDB Connected (Local)'))
  .catch(err => console.error('❌ Database Error:', err));

// 3. DEFINE THE DATA STRUCTURE (Schema)
const orderSchema = new mongoose.Schema({
  orderId: String,
  customerName: String,
  amount: Number,
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'Processing' }, // Processing, Shipped, Delivered
  items: Array
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // In a real app, you would check this against a database of users.
    // For now, checking it here is 100x safer than on the Frontend.
    if (username === "admin" && password === "wefpro123") {
        res.json({ 
            success: true, 
            token: "secure-token-" + Math.random().toString(36).substr(2), // Generate a random key
            message: "Login Successful"
        });
    } else {
        res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
});
// Create the Model
const Order = mongoose.model('Order', orderSchema);

// --- ROUTES ---

app.get('/', (req, res) => {
  res.send('Wefpro Backend is Running & Connected to DB');
});

// GET ALL ORDERS (For Admin Dashboard)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 }); // Newest first
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

// CREATE INVOICE & SAVE ORDER
app.post('/api/create-invoice', async (req, res) => {
    const { orderId, customerName, customerAddress, customerCity, customerPincode, amount } = req.body;

    try {
        // 4. SAVE TO DATABASE FIRST
        const newOrder = new Order({
            orderId,
            customerName,
            amount,
            items: [{ name: "Strawberry Jam", qty: 2 }] // Simplified for demo
        });
        await newOrder.save();
        console.log(`✅ Order ${orderId} saved to database.`);

        // 5. THEN GENERATE PDF
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderId}.pdf`);
        doc.pipe(res);

        // ... (PDF Design - Keeping it simple for this snippet) ...
        doc.fontSize(20).text('WEFPRO INVOICE', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Order ID: ${orderId}`);
        doc.text(`Customer: ${customerName}`);
        doc.text(`Total Paid: Rs. ${amount}`);
        doc.end();

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Server Error");
    }
});

// ... existing code ...

// UPDATE ORDER STATUS (Admin Action)
app.put('/api/orders/:id', async (req, res) => {
    const { status } = req.body; // e.g., "Shipped"
    const { id } = req.params;   // e.g., "WF-1234"

    try {
        // Find order by its ID and update the status
        await Order.findOneAndUpdate({ orderId: id }, { status: status });
        res.json({ success: true, message: "Status updated" });
        console.log(`✅ Order ${id} updated to ${status}`);
    } catch (error) {
        res.status(500).json({ error: "Update failed" });
    }
});
// GET SINGLE ORDER (For Tracking Page)
app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.id });
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

// app.listen is below here...
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});