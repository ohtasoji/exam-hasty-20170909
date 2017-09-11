const db = require('../db');

class Record {
  static get insertColumns() {
    return this.columns;
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
    let values = [];
    this.constructor.insertColumns.forEach((column) => {
      values.push(this[column]);
    });

    return db.query(
      "INSERT INTO ?? (??) VALUES (?)",
      [this.constructor.tableName, this.constructor.insertColumns, values]
    ).then((result) => {
      this.id = result[0].insertId;
      return this;
    });
  }

  destroy() {
    return db.query(
      'DELETE FROM ?? WHERE `id` = ?;',
      [this.constructor.tableName, this.id]
    ).then(() => {
      this.id = null;
      return this;
    });
  }
}

module.exports = Record;
