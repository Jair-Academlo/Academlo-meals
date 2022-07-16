const { Order } = require('../models/order.model');
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');
const { catchAsync } = require('../utils/catchAsync');

const createOrder = catchAsync(async (req, res, next) => {
  const { sessionUser, meal } = req;
  const { quantity, mealId } = req.body;

  const newOrder = await Order.create({
    mealId,
    userId: sessionUser.id,
    totalPrice: meal.price * quantity,
    quantity,
  });

  res.status(201).json({
    status: 'success',
    newOrder,
  });
});

const getAllUserOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Order.findAll({
    where: {
      userId: sessionUser.id,
    },
    include: {
      model: Meal,
      include: Restaurant,
    },
  });

  res.status(200).json({
    status: 'success',
    orders,
  });
});

const completeOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({
    status: 'completed',
  });

  res.status(204).json({
    status: 'success',
  });
});

const cancellOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({
    status: 'cancelled',
  });

  res.status(204).json({
    status: 'success',
  });
});

module.exports = { createOrder, getAllUserOrders, completeOrder, cancellOrder };
