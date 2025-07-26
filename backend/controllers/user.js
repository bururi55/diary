const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generate } = require("../helpers/token");
const ROLES = require("../constants/roles");

async function register(login, email, password) {
  if (!password) {
    throw new Error("Password is empty");
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ login, email, password: passwordHash });
  const token = generate({ id: user.id });
  return { user, token };
}

async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Wrong password!");
  }
  const token = generate({ id: user.id });
  return { token, user };
}

async function getUsers() {
  return await User.find();
}

function getRoles() {
  return [
    { id: ROLES.ADMIN, name: "Admin" },
    { id: ROLES.USER, name: "User" },
  ];
}

async function deleteUser(id) {
  return await User.deleteOne({ _id: id });
}

async function updateUser(id, userData) {
  return await User.findByIdAndUpdate(id, userData, {
    returnDocument: "after",
  });
}

module.exports = {
  register,
  login,
  getUsers,
  getRoles,
  deleteUser,
  updateUser,
};
