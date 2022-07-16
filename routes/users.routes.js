const express = require('express');

const {
  signup,
  login,
  updateUser,
  deleteUser,
  getUserOrders,
  getUserOrderById,
} = require('../controllers/users.controller');

const {
  createUserValidators,
} = require('../middlewares/validators.middleware');
const {
  protectedSession,
  protectedUserAccount,
} = require('../middlewares/auth.middleware');
const { userExists } = require('../middlewares/users.middleware');
const { orderExists } = require('../middlewares/orders.middleware');

const usersRouter = express.Router();

usersRouter.post('/signup', createUserValidators, signup);

usersRouter.post('/login', login);

usersRouter.use(protectedSession);

usersRouter.get('/orders', getUserOrders);

usersRouter.get('/orders/:id', orderExists, getUserOrderById);

usersRouter
  .use('/:id', userExists, protectedUserAccount)
  .route('/:id')
  .patch(updateUser)
  .delete(deleteUser);

module.exports = { usersRouter };
