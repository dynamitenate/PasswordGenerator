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
//var authenticated = true;
app.post('/authenticate', function(req, res) {
	console.log(req.body.username);
	console.log(req.body.password);
	
	var email = req.body.username;
	var password = req.body.password;
	var authenticated = true;
	var errorCode;
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  		// Handle Errors here.
  		errorCode = error.code;
		var errorMessage = error.message;
		console.log(errorCode + ": " + errorMessage);
		authenticated = false;
	});
	
	setTimeout(function() {
		if (authenticated == false) {
			if (errorCode == "auth/wrong-password") {
				res.send("Wrong Password!");
			} else if (errorCode == "auth/user-not-found") {
				res.send("User not found!");
			}
		}
		else if (authenticated == true) {
			res.send("Success! " + email);
		}
	}, 2000);
});

app.post('/signUp', function(req, res) {
	console.log(req.body.username);
	console.log(req.body.password);

	email = req.body.username;
	password = req.body.password;
	
	var errorCode;
	var errorBool = false;
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  		// Handle Errors here.
		errorBool = true;
  		errorCode = error.code;
		console.log(errorCode);
  		var errorMessage = error.message;
		console.log(errorMessage);
	});
	
	setTimeout(function() {
		if (errorBool == false) {
			console.log("It comes here!");
			res.send("User created!");
		} else {
			if (errorCode == "auth/email-already-in-use") {
				res.send("Email already in use!");
			} else if (errorCode == "auth/invalid-email") {
				res.send("Invalid email!");
			} else if (errorCode == "auth/weak-password") {
				res.send("Weak Password, Please try again with a different password.");
			}
		}
	}, 1000);
});

app.post('/generate', function(req, res) {
	console.log(req.body.content);
	var content = req.body.content;
	
	var words = content.split(" ");
	
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
