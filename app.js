const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const notFoundController = require('./controllers/notFound');

const adminRoutes = require('./routes/admin');
const { mongoConnect } = require('./util/database');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.fetchOne('647c953e0e4bd228880e7479')
    .then((user) => {
      req.user = new User(user.username, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(notFoundController.getNotFoundPage);

mongoConnect(() => {
  app.listen(3000);
});
