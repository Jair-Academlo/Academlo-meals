const express = require('express');

const {
  createOrder,
  getAllUserOrders,
  completeOrder,
  cancellOrder,
} = require('../controllers/orders.controller.js');

const { protectedSession } = require('../middlewares/auth.middleware');
const { mealExists } = require('../middlewares/meals.middleware.js');
const { orderUserIsActive } = require('../middlewares/orders.middleware.js');

const ordersRouter = express.Router();

ordersRouter.use(protectedSession);

ordersRouter.post('/', mealExists, createOrder);

ordersRouter.get('/me', getAllUserOrders);

ordersRouter
  .use('/:id', orderUserIsActive)
  .route('/:id')
  .patch(completeOrder)
  .delete(cancellOrder);

module.exports = { ordersRouter };
