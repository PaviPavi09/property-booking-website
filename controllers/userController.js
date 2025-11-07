import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

// Get all users 
export const getAllUsers = async (req, res) => {
  try {
      if (req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Access denied' });
      }
      const users = await User.find().select('-password');
      res.status(200).json(users);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }   
      res.status(200).json(user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
      const { name, email, phone, password, profileImage } = req.body;
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (req.user.id !== req.params.id && req.user.role !== 'admin') {
          return res.status(403).json({ message: "Access denied" });
      }

      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.profileImage = profileImage || user.profileImage;

      if (password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
      }

      await user.save();
      res.status(200).json(user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};

// Delete user 
export const deleteUser = async (req, res) => {
  try {
      if(req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Access denied' });
      }
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};

// Change user role
export const changeUserRole = async (req, res) => {
  try {
      if(req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Access denied' });
      }
      const { role } = req.body;
      const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};
