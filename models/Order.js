import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true, index: true }, // ⚡ Indexed
  invoiceId: { type: String, required: true, index: true },             // ⚡ Indexed
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
  paymentStatus: { type: String, default: 'Paid' },
  status: { type: String, default: 'Processing' }, 
  trackingId: { type: String, default: null, index: true },             // ⚡ Indexed
  createdAt: { type: Date, default: Date.now, index: -1 }               // ⚡ Indexed (Descending)
});

// Prevent model recompilation error in dev
export default mongoose.models.Order || mongoose.model('Order', OrderSchema);