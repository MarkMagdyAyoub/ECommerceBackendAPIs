const UserSchema = require('../models/userModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JSendStatus = require('../utils/jSendStatus');
const mailer = require('../utils/mailService/mailer');
const mongoose = require('mongoose');


const registration = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: JSendStatus.FAIL,
      data: errors.array()
    });
  }

  try {
    const { username, email, password, role, address, phone } = req.body;

    const existingUser = await UserSchema.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      const conflicts = [];
      if (existingUser.email === email) conflicts.push({ msg: 'Email already registered', field: 'email' });
      if (existingUser.username === username) conflicts.push({ msg: 'Username already taken', field: 'username' });

      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: conflicts
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserSchema({
      username,
      email,
      password: hashedPassword,
      role,
      address,
      phone,
      is_confirmed: false 
    });

    await newUser.save();

    await mailer.sendMail(newUser.email);

    res.status(201).json({
      status: JSendStatus.SUCCESS,
      data: {
        user: {
          id: newUser._id,
          email: newUser.email,
          username: newUser.username
        }
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: JSendStatus.ERROR,  
      message: 'Internal Server Error'
    });
  }
};


const verifyAccount = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: [{ msg: 'Verification token is required' }]
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: [{ msg: 'Invalid or expired token' }]
      });
    }

    const email = decoded.email; 

    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: [{ msg: 'User not found' }]
      });
    }

    if (user.is_confirmed) {
      return res.status(200).json({
        status: JSendStatus.SUCCESS,
        data: { msg: 'Account already verified' }
      });
    }

    user.is_confirmed = true;
    await user.save();

    res.status(200).json({
      status: JSendStatus.SUCCESS,
      data: { msg: 'Account verified successfully' }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: JSendStatus.ERROR,
      message: 'Internal Server Error'
    });
  }
};


const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: JSendStatus.FAIL,
      data: { errors: errors.array() }
    });
  }

  const { email, password } = req.body;

  try {
    const user = await UserSchema.findOne({ email });
    if (!user)
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: { message: "Invalid Credentials" }
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: { message: "Invalid Credentials" }
      });

    if (!user.is_confirmed)
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: { message: "Please Verify Your Email Before Logging In" }
      });

    const token = jwt.sign(
      { 
        id: user._id , 
        username: user.username,
        city: user.address.city,
        street: user.address.street,
        email: user.email , 
        role: user.role 
      }, 
      process.env.JWT_KEY, 
      { 
        expiresIn: process.env.TOKEN_LIFETIME 
      }
    );

    return res.status(200).json({
      status: JSendStatus.SUCCESS,
      data: {
        user_id: user._id,
        email: user.email,
        role: user.role,
        token: token
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: JSendStatus.ERROR,
      message: "Internal Server Error"
    });
  }
};

const getUsersPage = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: JSendStatus.FAIL,
      data: errors.array()
    });
  }

  let limit = parseInt(req.query.limit, 10) || 10;
  let page = parseInt(req.query.page, 10) || 1;
  const skip = (page - 1) * limit;

  const users = await UserSchema.find().limit(limit).skip(skip);

  res.json({
    status: JSendStatus.SUCCESS,
    data: {
      users: users
    }
  });
};


const deleteUserAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: JSendStatus.FAIL,
      data: { errors: errors.array() }
    });
  }
  try {
    const { id } = req.params;    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: { message: "Invalid user id" }
      });
    }

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        status: JSendStatus.FAIL,
        data: { message: "Only admins can delete user accounts" }
      });
    }

    const user = await UserSchema.findById(id);

    if (!user) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { message: "User not found" }
      });
    }

    await UserSchema.findByIdAndDelete(id);

    return res.status(200).json({
      status: JSendStatus.SUCCESS,
      data: { message: "User account deleted successfully" }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: JSendStatus.ERROR,
      message: "Internal Server Error"
    });
  }
};

const updateUserAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; 
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: { message: "Invalid user id" }
      });
    }

    if (req.user.role !== "ADMIN" && req.user.id !== id) {
      return res.status(403).json({
        status: JSendStatus.FAIL,
        data: { message: "You are not allowed to update this account" }
      });
    }

    const user = await UserSchema.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true } 
    );

    if (!user) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { message: "User not found" }
      });
    }

    return res.status(200).json({
      status: JSendStatus.SUCCESS,
      data: { user }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: JSendStatus.ERROR,
      message: "Internal Server Error"
    });
  }
};


const getUserAccountByEmail = async (req, res) => {
  try {
    const { email } = req.params; 
    
    if (!email) {
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: { message: "Email parameter is required" }
      });
    }

    const user = await UserSchema.findOne({ email: email });
    
    if (!user) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { message: "User not found" }
      });
    }

    const { password, ...userWithoutPassword } = user.toObject();

    return res.status(200).json({
      status: JSendStatus.SUCCESS,
      data: { user: userWithoutPassword }
    });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: JSendStatus.ERROR,
      message: "Internal Server Error"
    });
  }
};


const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserSchema.findById(id);

    if (!user) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { message: "User not found" }
      });
    }

    const { password, ...userWithoutPassword } = user.toObject();

    return res.status(200).json({
      status: JSendStatus.SUCCESS,
      data: { user: userWithoutPassword }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: JSendStatus.ERROR,
      message: "Internal Server Error"
    });
  }
};


const assignAdmin = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await UserSchema.findOne({ email: email });
    
    if (!user) {
      return res.status(404).json({
        status: JSendStatus.FAIL,
        data: { message: "User not found" }
      });
    }

    if (user.role === "ADMIN") {
      return res.status(400).json({
        status: JSendStatus.FAIL,
        data: { message: "User is already an admin" }
      });
    }

    const updatedUser = await UserSchema.findByIdAndUpdate(
      user._id,
      { $set: { role: "ADMIN" } },
      { new: true }
    );

    const { password, ...userWithoutPassword } = updatedUser.toObject();

    return res.status(200).json({
      status: JSendStatus.SUCCESS,
      data: { 
        message: "User has been assigned admin role successfully",
        user: userWithoutPassword 
      }
    });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: JSendStatus.ERROR,
      message: "Internal Server Error"
    });
  }
};

module.exports = {
  getUsersPage,
  registration,
  verifyAccount,
  login,
  deleteUserAccount,
  updateUserAccount,
  getUserAccountByEmail,
  assignAdmin,
  getUserById
};
