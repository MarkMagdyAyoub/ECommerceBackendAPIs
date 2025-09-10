const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true 
    },
    description: { 
      type: String, 
      required: true 
    } 
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
  }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
