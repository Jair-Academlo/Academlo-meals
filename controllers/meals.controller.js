const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');
const { catchAsync } = require('../utils/catchAsync');

const createRestaurantMeal = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { name, price } = req.body;

  const newMeal = await Meal.create({
    name,
    price,
    restaurantId: restaurant.id,
  });

  res.status(201).json({
    status: 'success',
    newMeal,
  });
});

const getAllActiveMeals = catchAsync(async (req, res, next) => {
  const meals = await Meal.findAll({
    where: { status: 'active' },
    include: Restaurant,
  });

  res.status(200).json({
    status: 'success',
    meals,
  });
});

const getActiveMealById = catchAsync(async (req, res, next) => {
  const { meal } = req;

  res.status(201).json({
    status: 'success',
    meal,
  });
});

const updateMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;
  const { name, price } = req.body;

  await meal.update({
    name,
    price,
  });

  res.status(204).json({
    status: 'success',
  });
});

const deleteMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  await meal.update({
    status: 'disabled',
  });

  res.status(204).json({
    status: 'success',
  });
});

module.exports = {
  createRestaurantMeal,
  getAllActiveMeals,
  getActiveMealById,
  updateMeal,
  deleteMeal,
};
