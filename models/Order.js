import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  // 1. New Fields Required for your App
  orderId: { type: String, required: true, unique: true }, 
  invoiceId: { type: String, required: true },
  address: { type: String, required: true }, // <--- Added Address
  
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Confirmed', 'Shipped', 'Delivered'], 
    default: 'Pending' 
  },
  trackingId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);