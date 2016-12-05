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

// Try to initialize the hashset and put the stopwords inside it.
var HashSet = require('native-hashset');
var stopWords = ["a","a's","able","about","above","according","accordingly","across","actually","after","afterwards","again","against","ain't","all","allow","allows","almost","alone","along","already","also","although","always","am","among","amongst","an","and","another","any","anybody","anyhow","anyone","anything","anyway","anyways","anywhere","apart","appear","appreciate","appropriate","are","aren't","around","as","aside","ask","asking","associated","at","available","away","awfully","b","be","became","because","become","becomes","becoming","been","before","beforehand","behind","being","believe","below","beside","besides","best","better","between","beyond","both","brief","but","by","c","c'mon","c's","came","can","can't","cannot","cant","cause","causes","certain","certainly","changes","clearly","co","com","come","comes","concerning","consequently","consider","considering","contain","containing","contains","corresponding","could","couldn't","course","currently","d","definitely","described","despite","did","didn't","different","do","does","doesn't","doing","don't","done","down","downwards","during","e","each","edu","eg","eight","either","else","elsewhere","enough","entirely","especially","et","etc","even","ever","every","everybody","everyone","everything","everywhere","ex","exactly","example","except","f","far","few","fifth","first","five","followed","following","follows","for","former","formerly","forth","four","from","further","furthermore","g","get","gets","getting","given","gives","go","goes","going","gone","got","gotten","greetings","h","had","hadn't","happens","hardly","has","hasn't","have","haven't","having","he","he's","hello","help","hence","her","here","here's","hereafter","hereby","herein","hereupon","hers","herself","hi","him","himself","his","hither","hopefully","how","howbeit","however","i","i'd","i'll","i'm","i've","ie","if","ignored","immediate","in","inasmuch","inc","indeed","indicate","indicated","indicates","inner","insofar","instead","into","inward","is","isn't","it","it'd","it'll","it's","its","itself","j","just","k","keep","keeps","kept","know","known","knows","l","last","lately","later","latter","latterly","least","less","lest","let","let's","like","liked","likely","little","look","looking","looks","ltd","m","mainly","many","may","maybe","me","mean","meanwhile","merely","might","more","moreover","most","mostly","much","must","my","myself","n","name","namely","nd","near","nearly","necessary","need","needs","neither","never","nevertheless","new","next","nine","no","nobody","non","none","noone","nor","normally","not","nothing","novel","now","nowhere","o","obviously","of","off","often","oh","ok","okay","old","on","once","one","ones","only","onto","or","other","others","otherwise","ought","our","ours","ourselves","out","outside","over","overall","own","p","particular","particularly","password","per","perhaps","placed","please","plus","possible","presumably","probably","provides","q","que","quite","qv","r","rather","rd","re","really","reasonably","regarding","regardless","regards","relatively","respectively","right","s","said","same","saw","say","saying","says","second","secondly","see","seeing","seem","seemed","seeming","seems","seen","self","selves","sensible","sent","serious","seriously","seven","several","shall","she","should","shouldn't","since","six","so","some","somebody","somehow","someone","something","sometime","sometimes","somewhat","somewhere","soon","sorry","specified","specify","specifying","still","sub","such","sup","sure","t","t's","take","taken","tell","tends","th","than","thank","thanks","thanx","that","that's","thats","the","their","theirs","them","themselves","then","thence","there","there's","thereafter","thereby","therefore","therein","theres","thereupon","these","they","they'd","they'll","they're","they've","think","third","this","thorough","thoroughly","those","though","three","through","throughout","thru","thus","to","together","too","took","toward","towards","tried","tries","truly","try","trying","twice","two","u","un","under","unfortunately","unless","unlikely","until","unto","up","upon","us","use","used","useful","uses","using","usually","uucp","v","value","various","very","via","viz","vs","w","want","wants","was","wasn't","way","we","we'd","we'll","we're","we've","welcome","well","went","were","weren't","what","what's","whatever","when","whence","whenever","where","where's","whereafter","whereas","whereby","wherein","whereupon","wherever","whether","which","while","whither","who","who's","whoever","whole","whom","whose","why","will","willing","wish","with","within","without","won't","wonder","would","wouldn't","x","y","yes","yet","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves","z","zero"];
var set = new HashSet.String();

// Putting all the stopwords in a HashSet
var i = 0;
for (i = 0; i < stopWords.length; i++) {
	set.add(stopWords[i]);
}

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
	var it = set.iterator();
 
	while (it.hasNext()) {
  		console.log(it.next());
	}
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


// Heart of the website, the not so "random" password generator
app.post('/generateRandom', function(req, res) {
	console.log(req.body.main);
	console.log(req.body.dates);
	console.log(req.body.extra);
	
	var main = req.body.main;
	var dates = req.body.dates;
	var extra = req.body.extra;
	
	var mW = main.split(",");
	var dW = dates.split(",");
	var eW1 = extra.split(" ");
	var eW = [];
	
	var i = 0;
	
	// Remove the stop words and the words less than 6 characters in length
	for (i = 0; i < eW1.length; i++) {
		if (eW1[i].length >= 6 && !set.contains(eW1[i]))
			eW.push(eW1[i]);
	}
	
	// Choose 1-2 words from the mW array
	var randomNumber = Math.floor(Math.random() * mW.length);
	var randomNumber2 = Math.floor(Math.random() * mW.length);
	
	// Choose one from the dates array
	var randomDate = Math.floor(Math.random() * dW.length);
	
	// (Optional) Choose one from the extra array
	var randomRandom = Math.floor(Math.random() * eW.length);
	
	if ((mW[randomNumber] == mW[randomNumber2]) && mW.length >= 2) {
		while (mW[randomNumber] == mW[randomNumber2]) {
			randomNumber2 = Math.floor(Math.random() * mW.length);
		}
	}
	
	var gen = mW[randomNumber] + mW[randomNumber2] + dW[randomDate];
	
	var gen2 = null;
	if (eW.length > 0)
		gen2 = mW[randomNumber] + mW[randomNumber2] + dW[randomDate] + eW[randomRandom];
	
	var gen3 = null;
	if (dW.length > 1 && eW.length > 1)
		gen3 = mW[randomNumber] + dW[randomNumber2] + mW[randomNumber2] + dW[randomDate] + eW[randomRandom];
	
	if (gen2 != null && gen3 != null)
		res.send(gen + " : " + gen2 + " : " + gen3);
	else if (gen2 != null)
		res.send(gen + " : " + gen3);
	else if (gen3 != null)
		res.send(gen + " : " + gen3);
	else
		res.send(gen);
});

var database = firebase.database();

app.post('/addEntry', function(req, res) {
	console.log(req.body.user);
	console.log(req.body.website);
	console.log(req.body.username);
	console.log(req.body.password);
	
	var user = req.body.user;
	var website = req.body.website;
	var username = req.body.username;
	var password = req.body.password;
	
	var ref = firebase.database().ref('/' + user + '/' + website);
	ref.once("value")
		.then(function(snapshot) {
		var check = snapshot.exists();
		if (check === true) {
			res.send("Cannot add, already exists!");
		} else {
			firebase.database().ref('/' + user + '/' + website).set({
				username: username,
				password: password
			});
			res.send("Hopefully done!");
		}
	});
});

app.post('/getEntries', function(req, res) {
	console.log(req.body.user);
	var user = req.body.user;
	
	var ref = firebase.database().ref('/' + user);
	
	ref.once("value", function(data) {
		console.log(data.val());
		res.send(data.val());
	});
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
