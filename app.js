/*eslint-env node*/

var express = require('express');

var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var bodyParser = require('body-parser');

var firebase = require('firebase');

var config = {
    apiKey: "AIzaSyDcbEovG_dBPQjDpuhrAtmU7Pv-HsG6Rww",
    authDomain: "passwordgenerator-c85fb.firebaseapp.com",
    databaseURL: "https://passwordgenerator-c85fb.firebaseio.com",
    storageBucket: "passwordgenerator-c85fb.appspot.com",
    messagingSenderId: "431247417376"
  };
firebase.initializeApp(config);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post('/test', function(req, res) {
	console.log(req.body.username);
	console.log(req.body.password);
	res.send("Success!");
});

//Firebase Authentication on the server
app.post('/authenticate', function(req, res) {
	console.log(req.body.username);
	console.log(req.body.password);
	
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  		// Handle Errors here.
  		var errorCode = error.code;
		var errorMessage = error.message;
		console.log(errorCode + ": " + errorMessage);
		res.send("error");
	});
	res.send("Success!");
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
