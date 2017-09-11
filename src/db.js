const mysql = require('mysql-promise');

let db = mysql();

db.configure({
	"host": "localhost",
	"user": "root",
	"password": "",
	"database": "exam-hasty-20170909",
});

module.exports = db;
