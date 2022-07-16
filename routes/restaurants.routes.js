const express = require('express');

const {
  createRestaurant,
  getAllActiveRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  createRestaurantReview,
  updateRestaurantReview,
  deleteRestaurantReview,
} = require('../controllers/restaurants.controller');

const {
  protectedSession,
  userAdminValidator,
} = require('../middlewares/auth.middleware');
const {
  createRestaurantValidators,
  createReviewValidators,
} = require('../middlewares/validators.middleware');
const { restaurantExists } = require('../middlewares/restaurants.middleware');
const { reviewValidation } = require('../middlewares/reviews.middleware');

const restaurantsRouter = express.Router();

restaurantsRouter.get('/', getAllActiveRestaurants);

restaurantsRouter.get('/:id', restaurantExists, getRestaurantById);

restaurantsRouter.use(protectedSession);

restaurantsRouter.post('/', createRestaurantValidators, createRestaurant);

restaurantsRouter.post(
  '/reviews/:restaurantId',
  restaurantExists,
  createReviewValidators,
  createRestaurantReview
);

restaurantsRouter
  .route('/reviews/:id')
  .patch(reviewValidation, updateRestaurantReview)
  .delete(reviewValidation, deleteRestaurantReview);

restaurantsRouter.use('/:id', restaurantExists);

restaurantsRouter
  .use(userAdminValidator)
  .route('/:id')
  .patch(updateRestaurant)
  .delete(deleteRestaurant);

module.exports = { restaurantsRouter };
