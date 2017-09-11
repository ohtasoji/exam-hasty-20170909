const db = require('../db');

class Article {
  static get tableName() {
    return "articles";
  }

  static get columns() {
    return ['title', 'body', 'created_at', 'updated_at'];
  }

  static all() {
    return db.query(
      "SELECT * FROM ??",
      [this.tableName]
    ).then((result) => {
      let rows = result[0];
      let articles = rows.map((row) => {
        return new this(row);
      });
      return articles;
    });
  }

  static get(id) {
    return db.query(
      "SELECT * FROM ?? WHERE `id` = ?",
      [this.tableName, id]
    ).then((result) => {
      let rows = result[0];
      if(rows.length === 0) {
        throw new Error(`${id} is not found`);
      }

      let articles = rows.map((row) => {
        return new this(row);
      });
      return articles[0];
    });
  }

  constructor(data = {}) {
    if(data && data['id']) {
      this.id = data.id;
    }
    this.assign(data);
  }

  assign(data) {
    if(!data) { return };

    this.constructor.columns.forEach((key) => {
      if (this[key] && !data[key]) {
        return;
      }
      this[key] = data[key];
    });
  }

  save() {
    if(this.id) {
      return this.update();
    } else {
      return this.create();
    }
  }

  update() {
    this['updated_at'] = new Date();

    let data = {};
    this.constructor.columns.forEach((column) => data[column] = this[column]);

    return db.query(
      "UPDATE ?? SET ? WHERE `id` = ?",
      [this.constructor.tableName, data, this.id]
    ).then((result) => {
      return this;
    });
  }

  create() {
    this['created_at'] = new Date();
    this['updated_at'] = new Date();
    let values = [];
    this.constructor.columns.forEach((column) => {
      values.push(this[column]);
    });

    return db.query(
      "INSERT INTO ?? (??) VALUES (?)",
      [this.constructor.tableName, this.constructor.columns, values]
    ).then((result) => {
      this.id = result[0].insertId;
      return this;
    });
  }
}

module.exports = Article;
