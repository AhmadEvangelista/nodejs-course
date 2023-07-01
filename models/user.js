const { default: mongoose } = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeCartItem = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return String(item.productId) !== String(productId);
  });

  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);

// const { getDb } = require('../util/database');
// const mongo = require('mongodb');

// const collection = 'users';
// const ObjectId = mongo.ObjectId;
// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDb();

//     return db
//       .collection(collection)
//       .insertOne(this)
//       .then((result) => console.log(result))
//       .catch((err) => console.log(err));
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       )
//       .then((result) => result)
//       .catch((err) => console.log(err));
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map((i) => i.productId);

//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: [
//               this.cart.items.find((i) => {
//                 return i.productId.toString() === p._id.toString();
//               }).quantity,
//             ],
//           };
//         });
//       })
//       .catch((err) => console.log(err));
//   }

//   removeCartItem(productId) {
//     const updatedCartItems = this.cart.items.filter((item) => {
//       return String(item.productId) !== String(productId);
//     });

//     const db = getDb();
//     return db
//       .collection(collection)
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             username: this.username,
//           },
//         };
//         return db.collection('orders').insertOne(order);
//       })
//       .then(() => {
//         this.cart = { item: [] };
//         return db
//           .collection(collection)
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       })
//       .catch((err) => console.log(err));
//   }

//   getOrders() {
//     const db = getDb();

//     return db
//       .collection('orders')
//       .find({ 'user._id': new ObjectId(this._id) })
//       .toArray()
//       .then((orders) => orders)
//       .catch((err) => console.log(err));
//   }

//   static fetchOne(id) {
//     const db = getDb();

//     return db
//       .collection(collection)
//       .find({ _id: new ObjectId(id) })
//       .next()
//       .then((result) => result)
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = User;
