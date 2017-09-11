const Record = require('./record');
const UUID = require('uuid/v4');

class UserSession extends Record {
  static get tableName() {
    return 'user_sessions';
  }

  static get columns() {
    return ['user_id'];
  }

  static get insertColumns() {
    return ['id', 'user_id'];
  }

  create() {
    this.id = UUID();
    return super.create();
  }
}

module.exports = UserSession;
