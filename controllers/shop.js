const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((result) => {
      res.render('shop/product-list', {
        prods: result[0],
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, (products) => {
    res.render('shop/product-detail', {
      product: products,
      pageTitle: products.title,
      path: '/products/' + prodId,
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((result) => {
      res.render('shop/index', {
        prods: result[0],
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll()
      .then((result) => {
        const cartProducts = [];
        for (product of result[0]) {
          const cartProductData = cart.products.find(
            (prod) => Number(prod.id) === Number(product.id)
          );
          if (cartProductData) {
            cartProducts.push({
              productData: product,
              qty: cartProductData.qty,
            });
          }
        }
        res.render('shop/cart', {
          products: cartProducts,
          pageTitle: 'Your Cart',
          path: '/cart',
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Your Orders',
    path: '/cart',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
