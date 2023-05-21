const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const notFoundController = require('./controllers/notFound');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(notFoundController.getNotFoundPage);

app.listen(3000);
