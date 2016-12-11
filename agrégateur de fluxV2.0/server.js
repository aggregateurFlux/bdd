var express 	 = require('express');
var app 	   	 = express();
var bodyparser= require('body-parser');
var mysql 		 = require('mysql');
var config 		 = require('./config.js');
var sql 	    	= require('mssql');
wait            =require('wait.for');

var port = process.env.PORT || 8080;
var connection = mysql.createConnection(config.bdd);
connection.connect();



// ROUTES -------------------------------------------------------------
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});


//get user for identification 
app.get('/get/identification', function (req, res) {
 	var ask       = req.headers;
 	var loginU    = ask.login;
  var mdpU      = ask.password;
  var sqlSelect = "SELECT * FROM user WHERE login = ?;";

	connection.query(sqlSelect,loginU, function(err, rows, fields) {
  	if (err) {
  	 console.log('Error while performing Query.');
   }
    else {
      if (rows[0].password == mdpU) {
        var userF = {id : rows[0].id}
        var result = userF;
      }
      else {
        var result = "bad password";
      }

      res.setHeader("Content-Type","text/json");
      res.end(JSON.stringify(result));
    }
  }); 
});


//get token from other API 
app.get('/get/user', function(req, res) {
  var ask       = req.headers;
  var idU       = ask.id;
  var sqlSelect = "SELECT * FROM user JOIN socialnetwork ON user.id = socialnetwork.userIdentifiant LEFT JOIN twitter ON socialnetwork.idS = twitter.socialNetworkId LEFT JOIN instagram ig ON ig.socialNetworkId = socialnetwork.idS where user.id = ?;";


  connection.query(sqlSelect, idU, function(err, rows, fields) {
    if (err) {
      console.log('Error while performing Query.');
    }
    else {
      var result = {
        id: rows[0].id,
        accessTokenId: rows[0].accessTokenId,
        accessTokenSecret: rows[0].accessTokenSecret,
        tokenInsta: rows[0].tokenInsta
      }
      res.setHeader("Content-Type","text/json");
      res.end( JSON.stringify(result) );
    }
  });
});



// create user 
app.post('/post/user',function(req, res) {
  var ask         = req.headers; 
  var loginU      = ask.login;
  var passwordU   = ask.password;
  var sqlInsert   = "INSERT INTO user (login, password) VALUES (?, ?);";
  var sqlSelectid = "SELECT id FROM user WHERE login = ? AND password = ?;";
  
  console.log(loginU);
  console.log(passwordU);

  connection.query(sqlInsert,[loginU,passwordU], function(err, rows, fields) {
    if (err) {
     console.log('Error while performing Query.');
   }
   else {
    connection.query(sqlSelectid,[loginU,passwordU], function(err, rows, fields) {
      if (err) {
        console.log('Error while performing Query 2.');
      }
      else {
        res.setHeader("Content-Type","text/json");
        res.end(JSON.stringify({id : rows[0].id}));
      }
    });
   }
  });
});

//check link in social network if not here create it 
/*function createSocialNetwork(valID) {
  var sqlSelect   = "SELECT * FROM user JOIN socialnetwork ON user.id = socialnetwork.userIdentifiant where user.id = ?"
  var sqlInsertSN = "INSERT INTO socialnetwork(userIdentifiant) VALUES (?);"
  connection.query(sqlSelect,valID, function(err, rows, fields) {
    if (err) {
      console.log('Error while performing Query.');
    }
    else {
      if (rows.length != 0) {
        return (rows[0].idS);
      }
      else {
        connection.query(sqlInsertSN,rows[0].id, function(err, rows, fields) {
          if (err) {
            console.log('Error while performing Query 2.');
          }
          else {
            return (rows[0].idS);
          }
        });    
      }
    }
  });
}

//create app twitter 
app.post('/post/apptwitter',function(req, res) {
  var ask         = req.headers; 
  var idU         = ask.id;
  var twACTOID    = ask.accessTokenId;
  var twACTOSE    = ask.accessTokenSecret;
  var sqlInsert   = "INSERT INTO twitter (socialNetworkId, accessTokenId, accessTokenSecret) VALUES (? , ? , ?);"
  var idSN        = wait.for(createSocialNetwork(idU)); 
  console.log(idSN);
  connection.query(sqlInsert,[idSN,twACTOID,twACTOSE], function(err, rows, fields) {
    if (err) {
      onsole.log('Error while performing Query.');
    }
    else {
      res.setHeader("Content-Type","text/json");
      res.end(JSON.stringify("app twitter créer");
    }
  });

});*/









app.listen(port);
console.log('Magic happens at http://localhost:' + port);