const path = require('path');
const { check } = require('express-validator');

const express = require('express');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.post(
  '/add-product',
  [
    check('title', 'Please enter valid title.').isString().isLength({ min: 3 }),
    check('imageUrl', 'Please enter valid imageUrl.').isURL(),
    check('price', 'Please enter valid price.').isFloat(),
    check('description', 'Please enter valid description.').isLength({
      min: 8,
      max: 150,
    }),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
  '/edit-product',
  [
    check('title', 'Please enter valid title.').isString().isLength({ min: 3 }),
    check('imageUrl', 'Please enter valid imageUrl.').isURL(),
    check('price', 'Please enter valid price.').isFloat().notEmpty(),
    check('description', 'Please enter valid description.').isLength({
      min: 8,
      max: 150,
    }),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
