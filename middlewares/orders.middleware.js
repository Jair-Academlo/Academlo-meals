const { Order } = require('../models/order.model.js');
const { Meal } = require('../models/meal.model.js');
const { Restaurant } = require('../models/restaurant.model.js');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const orderExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id },
    include: {
      model: Meal,
      include: {
        model: Restaurant,
      },
    },
  });

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  req.order = order;
  next();
});

const orderUserIsActive = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;

  const order = await Order.findOne({
    where: {
      id,
      status: 'active',
    },
    include: {
      model: Meal,
      include: {
        model: Restaurant,
      },
    },
  });

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.userId !== sessionUser.id) {
    return next(new AppError('You are not the owner of this order', 400));
  }

  req.order = order;
  next();
});

module.exports = { orderExists, orderUserIsActive };
