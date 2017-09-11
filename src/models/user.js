const db = require('../db');
const Record = require('./record');
const crypto = require('crypto');

function hashPassword(salt, password) {
  return crypto.createHash('sha512')
    .update(salt)
    .update(password)
    .digest('hex');
}

class User extends Record {
  static get tableName() {
    return 'users';
  }

  static get columns() {
    return ['email', 'password', 'salt'];
  }

  static signup(email, rawPassword) {
    return new Promise((resolve, reject) => {
      let salt = crypto.randomBytes(8).toString('hex');
      let hashedPassword = hashPassword(salt, rawPassword);

      let user = new this({
        email: email,
        password: hashedPassword,
        salt: salt,
      });

      user.save().then(() => {
        resolve(user);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  static authenticate(email, rawPassword) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM ?? WHERE `email` = ?",
        [this.tableName, email]
      ).then((result) => {
        let rows = result[0];
        return rows.map((row) => new this(row));
      }).then((users) => {
        if (users.length < 1) {
          throw new Error('User not found');
        }
        let user = users[0];

        let salt = user.salt;
        let hashedPassword = hashPassword(salt, rawPassword);
        if (hashedPassword !== user.password) {
          throw new Error('Password is not match');
        }

        resolve(user);
      }).catch((error) => {
        reject(error);
      });
    });
  }
}

module.exports = User;
