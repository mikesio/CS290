var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_siom',
  password        : '3150',
  database        : 'cs290_siom'
});

module.exports.pool = pool;
