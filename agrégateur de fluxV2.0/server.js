var express 	= require('express');
var app 		= express();
var bodyParser = require('body-parser');
var mysql 		= require('mysql');
var jwt 		= require('jsonwebtoken');
var config 		= require('./config.js');
var sql 		= require('mssql');

var port = process.env.PORT || 8080;
var connection = mysql.createConnection(config.bdd);
connection.connect();
app.set('superSecret',config.secret);



// ROUTES -------------------------------------------------------------
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.get('/get', function (req, res) {
 	var ask = req.headers;
 	sql.varchar(45) x = ask.name;
 	console.log(x);
	connection.query('select * from usertest', function(err, rows, fields) {
	  if (err)
	    console.log('Error while performing Query.');
  else
  	for (var i in rows) {
  		if (rows[i].name == x) {
  			console.log('The user is: ', rows[i]);
  		}
  	}
//	  res.end(JSON.stringify(rows));
	});
});


app.listen(port);
console.log('Magic happens at http://localhost:' + port);