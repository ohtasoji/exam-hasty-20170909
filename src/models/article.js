const db = require('../db');
const Record = require('./record');

class Article extends Record {
  static get tableName() {
    return "articles";
  }

  static get columns() {
    return ['title', 'body', 'image', 'created_at', 'updated_at'];
  }

  static all() {
    return db.query(
      "SELECT * FROM ?? ORDER BY `updated_at` DESC",
      [this.tableName]
    ).then((result) => {
      let rows = result[0];
      let articles = rows.map((row) => {
        return new this(row);
      });
      return articles;
    });
  }

  static getPage(page) {
    const COUNT_IN_PAGE = 50;
    let offset = page * COUNT_IN_PAGE;
    return db.query(
      "SELECT * FROM ?? ORDER BY `updated_at` DESC LIMIT ? OFFSET ?",
      [this.tableName, COUNT_IN_PAGE, offset]
    ).then((result) => {
      let rows = result[0];
      let articles = rows.map((row) => {
        return new this(row);
      });
      return articles;
    });
  }

  constructor(data = {}) {
    super(data);
  }

  update() {
    this['updated_at'] = new Date();
    return super.update();
  }

  create() {
    this['created_at'] = new Date();
    this['updated_at'] = new Date();
    return super.create();
  }
}

module.exports = Article;
