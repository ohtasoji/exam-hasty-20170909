const db = require('../db');

class Collection{
  constructor(klass){
    this.klass = klass;
    this._where = {};
    this._order = {};
    this._limit = undefined;
    this._offset = undefined;
  }


  
  clone(){
    let cloned = new this.constructor(this.klass);
    cloned._where = Object.assign({},this._where);
    cloned._order = Object.assign({},this._order);
    cloned._limit = this._limit;
    cloned._offset = this._offset;
    return cloned;
  }

  where(value){
    let assigned = this.clone();
    assigned._where = Object.assign(assigned._where, value);
    return assigned;
  }

  order(column,direction = "asc"){//orderを作ってtootの順番を最新順にする。routes/api/tootsに渡す
    // SELECT *FROM `table` ORDER BY id DESC
    //ASCEND / DESCEND
    let assigned = this.clone();
    assigned._order = {column: column,direction: direction};
    return assigned;
  }

  then(f){
    let sqlParts = [`SELECT * FROM ??`];
    let sqlValues = [this.klass.tableName()];
    if(Object.keys(this._where).length > 0){
      sqlParts.push('WHERE');
      let wheres = [];
      Object.keys(this._where).forEach((key)=>{
        wheres.push('?? = ?');
        sqlValues.push(key, this._where[key]);
      })
      sqlParts.push(wheres.join(' AND '));
    }

    if(this._order.column){
      sqlParts.push('ORDER BY')
      if(this._order.direction.toLowerCase() === "asc"){
        sqlParts.push('?? ASC');
      }else{
        sqlParts.push('?? DESC');
      }
      sqlValues.push(this._order.column)
    }

    return new Promise((resolve,reject)=>{
      db.query(sqlParts.join(' '),sqlValues).then((result)=>{
        let rows = result[0];
        let fields = result[1];
        let records = rows.map((row)=>{
          return new this.klass(row);
        });
        resolve(records);
      }).catch((error)=>{
        reject(error);
      });
    }).then(f);
  }

}
module.exports = Collection;