const { default: mongoose } = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Product', productSchema);

// const { getDb } = require('../util/database');
// const mongo = require('mongodb');

// const ObjectId = mongo.ObjectId;

// class Product {
//   constructor(title, price, description, imageUrl, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this.userId = new ObjectId(userId);
//   }

//   save() {
//     const db = getDb();

//     return db
//       .collection('products')
//       .insertOne(this)
//       .then((result) => console.log(result))
//       .catch((err) => console.log(err));
//   }

//   static fetchAll() {
//     const db = getDb();

//     return db
//       .collection('products')
//       .find({})
//       .toArray()
//       .then((result) => result)
//       .catch((err) => console.log(err));
//   }

//   static fetchOne(id) {
//     const db = getDb();

//     return db
//       .collection('products')
//       .find({ _id: new ObjectId(id) })
//       .toArray()
//       .then((result) => result[0])
//       .catch((err) => console.log(err));
//   }

//   static removeOne(id) {
//     const db = getDb();

//     return db
//       .collection('products')
//       .deleteOne({ _id: new ObjectId(id) })
//       .then((result) => result)
//       .catch((err) => console.log(err));
//   }

//   static updateOne(id, parameter) {
//     const db = getDb();

//     return db
//       .collection('products')
//       .updateOne({ _id: new ObjectId(id) }, { $set: parameter })
//       .then((result) => result)
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = Product;
