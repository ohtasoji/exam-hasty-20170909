const db = require('../db');

class Article {
  static get tableName() {
    return "articles";
  }

  static get columns() {
    return ['title', 'body','created_at'];
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
    let date = new Date();
    date = date.getUTCFullYear() + '-' +
      ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
      ('00' + date.getUTCDate()).slice(-2) + ' ' + 
      ('00' + date.getUTCHours()).slice(-2) + ':' + 
      ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
      ('00' + date.getUTCSeconds()).slice(-2);
    return db.query(
      "UPDATE ?? SET ? WHERE `id` = ?",
      [this.constructor.tableName, this.data, date, this.id]
    )
  }

  create() {
    let values = [];
    this.constructor.columns.forEach((column) => {
      values.push(this[column]);
    });
    values.pop()
    let date = new Date();
    date = date.getUTCFullYear() + '-' +
      ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
      ('00' + date.getUTCDate()).slice(-2) + ' ' + 
      ('00' + date.getUTCHours()).slice(-2) + ':' + 
      ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
      ('00' + date.getUTCSeconds()).slice(-2);
    values.push(date.toString())

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
