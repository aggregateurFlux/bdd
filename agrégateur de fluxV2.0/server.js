var express 	 = require('express');
var app 	   	 = express();
var mysql 		 = require('mysql');
var config 		 = require('./config.js');

var port = process.env.PORT || 8081;
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
        var result = "mauvais mot de passe";
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
var createSocialNetwork = function (valID) {
  //var promise = new Promise();

  var sqlSelect   = "SELECT * FROM user JOIN socialnetwork ON user.id = socialnetwork.userIdentifiant where user.id = ?"
  var sqlInsertSN = "INSERT INTO socialnetwork(userIdentifiant) VALUES (?);"
  connection.query(sqlSelect,valID, function(err, rows, fields) {
    console.log("test");
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
            //promise.resolve( rows[0].idS );
          }
        });    
      }
    }

    //return promise;
  });
  /*
  var promise = new Promise();

  // assuming processObjWithRef takes a callback
  processObjWithRef(samplePayload, myNewObj, callStack, function() {
    if (callStack.length == 0) {
      promise.resolve(some_results);
    }
  });

  return promise;*/
}
/*
//create app twitter 
app.post('/post/apptwitter',function(req, res) {
  var ask         = req.headers; 
  var idU         = ask.id;
  var twACTOID    = ask.accessTokenId;
  var twACTOSE    = ask.accessTokenSecret;
  var sqlInsert   = "INSERT INTO twitter (socialNetworkId, accessTokenId, accessTokenSecret) VALUES (? , ? , ?);"
  var idSN        =  createSocialNetwork(idU,);
  console.log("idSN : ", idSN);
  connection.query(sqlInsert,[idSN,twACTOID,twACTOSE], function(err, rows, fields) {
    if (err) {
      console.log('Error while performing Query.');
    }
    else {
      res.setHeader("Content-Type","text/json");
      res.end(JSON.stringify("app twitter créer");
    }
  });
});

//create app instagram 
app.post('/post/appinstagram',function(req, res) {
  var ask         = req.headers; 
  var idU         = ask.id;
  var instTOKEN   = ask.tokenInsta;
  var sqlInsert   = "INSERT INTO instagram (socialNetworkId, tokenInsta) VALUES (? , ?);";
  var idSN        =  createSocialNetwork(idU);
  console.log("idSN : ", idSN);
  connection.query(sqlInsert,[idSN,instTOKEN], function(err, rows, fields) {
    if (err) {
      console.log('Error while performing Query.');
    }
    else {
      res.setHeader("Content-Type","text/json");
      res.end(JSON.stringify("app instagram créer");
    }
  });
});
*/



app.listen(port);
console.log('Magic happens at http://localhost:' + port);