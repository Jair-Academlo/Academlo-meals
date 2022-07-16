const { app } = require('./app');
require('colors');

const { User } = require('./models/user.model');
const { Restaurant } = require('./models/restaurant.model');
const { Meal } = require('./models/meal.model');
const { Review } = require('./models/review.model');
const { Order } = require('./models/order.model');

const { db } = require('./utils/database');

db.authenticate()
  .then(() => console.log('Database authenticated'.magenta))
  .catch(err => console.log(err));

Restaurant.hasMany(Review);
Review.belongsTo(Restaurant);

Restaurant.hasMany(Meal);
Meal.belongsTo(Restaurant);

Meal.hasOne(Order);
Order.belongsTo(Meal);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Review);
Review.belongsTo(User);

db.sync()
  .then(() => console.log('Database synced'.cyan))
  .catch(err => console.log(err));

app.listen(app.get('PORT'), () => {
  console.log(`Server on port ${app.get('PORT')}`.yellow);
});
