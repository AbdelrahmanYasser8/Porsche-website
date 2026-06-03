const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
   orderId: {
  type: String,
  unique: true,
  trim: true
},
  customer: {
    type: String,
    required: true,
    trim: true
  },
 
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  product: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  wheelType: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Processing', 'Completed', 'Cancelled'],
    default: 'Processing'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    const year = new Date().getFullYear();
    this.orderId = `ORD-${year}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
