const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(
    title,
    price,
    imageUrl,
    description,
    null,
    req.user._id
  );
  product
    .save()
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.fetchOne(prodId)
    .then((products) => {
      if (!products) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        product: products,
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const product = {
    title: updatedTitle,
    price: updatedPrice,
    description: updatedDescription,
    imageUrl: updatedImageUrl,
  };
  Product.updateOne(prodId, product)
    .then(() => res.redirect('/products'))
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((product) => {
      res.render('admin/products', {
        prods: product,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.removeOne(prodId)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};
