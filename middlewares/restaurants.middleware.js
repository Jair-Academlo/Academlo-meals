const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const restaurantExists = catchAsync(async (req, res, next) => {
  const { id, restaurantId } = req.params;

  const restaurant = await Restaurant.findOne({
    where: { id: id || restaurantId },
    include: Review,
  });

  if (!restaurant) {
    return next(new AppError('Restaurant not found', 404));
  }

  req.restaurant = restaurant;
  next();
});

module.exports = { restaurantExists };
