const db = require('../util/database');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    if (this.id) {
      return db.execute(
        `UPDATE products SET title='${String(this.title)}',imageUrl='${String(
          this.imageUrl
        )}', description='${String(this.description)}', price=${Number(
          this.price
        )} WHERE id = ${Number(this.id)}`
      );
    }

    return db.execute(
      `INSERT INTO products (title, imageUrl, description, price ) VALUES ('${String(
        this.title
      )}','${String(this.imageUrl)}','${String(this.description)}',${Number(
        this.price
      )})`
    );
  }

  static deleteById(id) {
    return db.execute(`DELETE FROM products WHERE id = ${Number(id)}`);
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    return db.execute(`SELECT * FROM products WHERE id = ${Number(id)}`);
  }
};
