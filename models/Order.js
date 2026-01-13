import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, 
  invoiceId: { type: String, required: true },
  address: { type: String, required: true }, 
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  totalAmount: { type: Number, required: true },
  
  // 🟢 NEW: Separate Statuses
  paymentStatus: { 
    type: String, 
    enum: ['Paid', 'Pending', 'Failed'], 
    default: 'Pending' 
  },
  status: { 
    type: String, 
    default: 'Processing' // This is now purely for Logistics
  }, 
  
  trackingId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);