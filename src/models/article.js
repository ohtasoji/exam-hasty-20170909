const db = require('../db');

class Article {
  static get tableName() {
    return "articles";
  }

  static get columns() {
    return ['title', 'body', 'updated_at', 'created_at'];
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
    this.data = this.assign(data);
    this.data["updated_at"] = new Date()
  }

  assign(data) {
    console.log("assaign !!")
    if(!data) { return };
    console.log(this.constructor.columns)
    this.constructor.columns.forEach((key) => {
      if(!key == "date_created") {
        this[key] = data[key];
      }
    });
    return data;
  }

  save() {
    console.log("save !!")
    if(this.id) {
      return this.update();
    } else {
      return this.create();
    }
  }

  update() {
    console.log("update!!!");
    console.dir(this.data)
    
    return db.query(
      "UPDATE ?? SET ? WHERE `id` = ?",
      [this.constructor.tableName, this.data, this.id]
    )
  }

  create() {
    let values = [];
    this.created_at = new Date();
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

  destroy() {
    if(!this.id) {
      return;
    }
    return db.query(
      "DELETE FROM ?? WHERE `id` = ?",
      [this.constructor.tableName, this.id]
    )
  }
}

module.exports = Article;
