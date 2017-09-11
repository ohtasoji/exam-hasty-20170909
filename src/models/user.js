const crypto = require('crypto')
const db = require('../db');
const Record = require('./record');
const Collection = require('./collection');
const Toot = require('./toot');

class User extends Record {
  static tableName() {
    return "users"
  }

  static columns() {
    return ["email", "password", "nickname", "salt"];
  }

  static create(nickname, email, raw_password) {
    return new Promise((resolve, reject) => {
      let salt = crypto.randomBytes(8).toString('hex');
      let sha512 = crypto.createHash('sha512');
      sha512.update(salt);
      sha512.update(raw_password);
      let hashed_password = sha512.digest('hex');

      let user = new this({
        nickname: nickname,
        email: email,
        password: hashed_password,
        salt: salt
      });
      user.save().then(() => {
        resolve(user);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  static authenticate(email, raw_password) {
    return new Promise((resolve, reject) => {
      this.collection().where({ email: email }).then((users) => {
        if (users.length < 1) {
          throw new Error("User not found");
        }
        let user = users[0];
        let salt = user.data.salt;
        let sha512 = crypto.createHash('sha512');
        sha512.update(salt);
        sha512.update(raw_password);
        let hashed_password = sha512.digest('hex');

        if (hashed_password !== user.data.password) {
          throw new Error("Password is not match")
        }
        resolve(user);
      }).catch((err)=>{
        reject(err);
      });
    });
  }

  toots() {
    return (new Collection(Toot)).where({ user_id: this.data.id });
  }

}

module.exports = User;