const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');
const { catchAsync } = require('../utils/catchAsync');

const createRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  const newRestaurant = await Restaurant.create({
    name,
    address,
    rating,
  });

  res.status(201).json({
    status: 'success',
    newRestaurant,
  });
});

const getAllActiveRestaurants = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.findAll({
    where: { status: 'active' },
    include: {
      model: Review,
      where: { status: 'active' },
    },
    required: false,
  });

  res.status(200).json({
    status: 'success',
    restaurants,
  });
});

const getRestaurantById = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  res.status(200).json({
    status: 'success',
    restaurant,
  });
});

const updateRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { name, address } = req.body;

  await restaurant.update({
    name,
    address,
  });

  res.status(204).json({
    status: 'success',
  });
});

const deleteRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await restaurant.update({
    status: 'disabled',
  });

  res.status(204).json({
    status: 'success',
  });
});

const createRestaurantReview = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { restaurantId } = req.params;
  const { comment, rating } = req.body;

  const newRestaurantReview = await Review.create({
    userId: sessionUser.id,
    comment,
    restaurantId,
    rating,
  });

  res.status(201).json({
    status: 'success',
    newRestaurantReview,
  });
});

const updateRestaurantReview = catchAsync(async (req, res, next) => {
  const { review } = req;
  const { comment, rating } = req.body;

  await review.update({
    comment,
    rating,
  });

  res.status(204).json({
    status: 'success',
  });
});

const deleteRestaurantReview = catchAsync(async (req, res, next) => {
  const { review } = req;

  await review.update({
    status: 'disabled',
  });

  res.status(204).json({
    status: 'success',
  });
});

module.exports = {
  createRestaurant,
  getAllActiveRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  createRestaurantReview,
  updateRestaurantReview,
  deleteRestaurantReview,
};
