const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config.env' });
const { User } = require('../models/user.model.js');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const { ADMIN_ROLE } = require('../utils/roles/roles');

const protectedSession = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new AppError('Invalid token', 403));
  }

  const token = authorization.split(' ')[1];

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({
    where: { id: decoded.id, status: 'active' },
  });

  if (!user) {
    return next(
      new AppError('The owner of this account does not exist anymore', 403)
    );
  }

  req.sessionUser = user;
  next();
});

const protectedUserAccount = (req, res, next) => {
  const { sessionUser, user } = req;

  if (sessionUser.id !== user.id) {
    return next(new AppError('You don not own this account', 400));
  }

  next();
};

const userAdminValidator = (req, res, next) => {
  const { sessionUser } = req;

  if (sessionUser.role !== ADMIN_ROLE) {
    return next(
      new AppError('You do not have the permissions for this action', 403)
    );
  }

  next();
};

module.exports = {
  protectedSession,
  protectedUserAccount,
  userAdminValidator,
};
