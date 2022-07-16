const express = require('express');

const {
  createRestaurantMeal,
  getAllActiveMeals,
  getActiveMealById,
  updateMeal,
  deleteMeal,
} = require('../controllers/meals.controller');

const {
  protectedSession,
  userAdminValidator,
} = require('../middlewares/auth.middleware');
const { mealExists } = require('../middlewares/meals.middleware');
const { restaurantExists } = require('../middlewares/restaurants.middleware');
const {
  createMealValidators,
} = require('../middlewares/validators.middleware');

const mealsRouter = express.Router();

mealsRouter.get('/', getAllActiveMeals);
mealsRouter.get('/:id', mealExists, getActiveMealById);

mealsRouter.use(protectedSession);

mealsRouter.post(
  '/:id',
  restaurantExists,
  createMealValidators,
  createRestaurantMeal
);

mealsRouter
  .use('/:id', userAdminValidator, mealExists)
  .route('/:id')
  .patch(updateMeal)
  .delete(deleteMeal);

module.exports = { mealsRouter };
