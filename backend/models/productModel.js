const mongoose = require('mongoose');

const Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category', required: true 
    },
    brand: { type: String },
    description: { type: String },
    stock: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
  }, 
  { 
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } ,
    versionKey: false
  }
);

Schema.index({name:"text"});

const ProductSchema = mongoose.model('Product' , Schema);

module.exports = ProductSchema;