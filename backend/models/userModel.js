const mongoose = require('mongoose');

const Schema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' },
    address: {
      city: { type: String, required: true },
      street: { type: String, required: true }
    },
    phone: { type: String, required: true },
    is_confirmed : {type:Boolean , default:false}
  }, 
  { 
    timestamps: true,
    versionKey: false
  }
);

const UserSchema = mongoose.model('User' , Schema);

module.exports = UserSchema;