const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config.env' });
const { User } = require('../models/user.model');
const { Order } = require('../models/order.model');
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (user) {
    return next(new AppError('This email is already taken', 400));
  }

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
  });

  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    newUser,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return next(new AppError('Wrong credentials', 400));
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return next(new AppError('Wrong credentials', 400));
  }

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });

  res.status(200).json({
    status: 'success',
    token,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email } = req.body;

  await user.update({
    name,
    email,
  });

  res.status(204).json({
    status: 'success',
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({
    status: 'disabled',
  });

  res.status(204).json({
    status: 'success',
  });
});

const getUserOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Order.findAll({
    where: { userId: sessionUser.id },
    include: {
      model: Meal,
      include: {
        model: Restaurant,
      },
    },
  });

  res.status(201).json({
    status: 'success',
    orders,
  });
});

const getUserOrderById = catchAsync(async (req, res, next) => {
  const { order } = req;

  res.status(201).json({
    status: 'success',
    order,
  });
});

module.exports = {
  signup,
  login,
  updateUser,
  deleteUser,
  getUserOrders,
  getUserOrderById,
};
