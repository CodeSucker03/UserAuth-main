const User = require("../model/User");

const getAllUser = async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(204).json({ message: "No user found" });
  res.json(users);
};

const deleteUser = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Please provide user id" });
  }
  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.body.id} not found` });
  }
  const result = await user.deleteOne({ _id: req.body.id });
  res.status(200).json(result);
};

const getUser = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Please provide user id" });
  }
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `user ID ${req.params.id} not found` });
  }
  res.status(200).json(user);
};
const updateUser = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Please provide user id" });
  }
  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `user ID ${req.body.id} not found` });
  }
  if (req.body?.roles) {
    // Merge new roles with existing roles
    user.roles = {
      ...user.roles,       // Keep existing roles
      ...req.body.roles,   // Add new roles or update existing ones
    };
  }
  const result = await user.save();
  res.status(200).json(result);
};

module.exports = {
  getAllUser,
  deleteUser,
  getUser,
  updateUser,
};
