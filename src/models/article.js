const db = require('../db');

class Article {
  static get tableName() {
    return "articles";
  }

  static get columns() {
    return ['title', 'body','create_at','update_at'];
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
    return db.query(
      "UPDATE ?? SET ? WHERE `id` = ?",
      [this.constructor.tableName, this.data, this.id]
    )
  }

  create() {
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
  destroy() {
    return new Promise((resolve, reject) => {
      let id = this.data.id
      super.destroy().then((toot) => {
        let conn = redis()
        conn.publish('local',
          JSON.stringify({
            action: "delete", toot: { id: id }
          })
        );
        resolve(toot);
      }).catch((error) => {
        reject(error);
      })
    })
  }
}

module.exports = Article;
