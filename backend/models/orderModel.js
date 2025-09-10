const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    items: [
      {
        product_id: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Product', 
          required: true 
        },
        quantity: { type: Number, required: true, min: 1 },
        price_at_purchase: { type: Number, required: true, min: 0 }
      }
    ],
    shipping_address: {
      city: { type: String, required: true },
      street: { type: String, required: true }
    },
    payment_status: { 
      type: String, 
      enum: ['pending', 'paid', 'failed', 'cancelled', 'refunded'], 
      default: 'pending' 
    },
    is_deleted: { type: Boolean, default: false },
    total_price: { type: Number, required: true, min: 0 },
  }, 
  { 
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
