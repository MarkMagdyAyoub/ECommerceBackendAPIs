const mongoose = require('mongoose');


const Schema = new mongoose.Schema(
  {
    user_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    item: {
      product_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },
      quantity: { type: Number, required: true, min: 1 }
    }
  }, 
  { 
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'} ,
    versionKey: false
  }
);

const CartSchema = mongoose.model('Cart' , Schema);

module.exports = CartSchema;


