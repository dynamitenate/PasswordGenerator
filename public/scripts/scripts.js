/*eslint-env node, browser*/
/*globals toastr data*/

toastr.options.closeButton = true;

function signupButton() {
	document.getElementById('signupB').disabled = true;
	var email = document.getElementById('emailSU').value;
	var pass1 = document.getElementById('pwdSU').value;
	var pass2 = document.getElementById('cpwd').value;
	if (pass1.localeCompare(pass2) != 0) {
		toastr.error('Your passwords do not match');
		//window.alert('Your passwords do not match');
		document.getElementById('signupB').disabled = false;
		return;
	}
	var data = JSON.stringify({"username": email, "password": pass1});
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", function () {
  		if (this.readyState === 4) {
			console.log(this.responseText);
			toastr.clear();
			if (this.responseText == "User created!") {
				toastr.success('Successfully signed up! Click on the Log In button to continue');
				//window.alert('Successfully signed up! Click on the Log In button to continue');
			} else if (this.responseText == "Email already in use!") {
				toastr.error('The email you supplied is already in use');
				//window.alert('The email you supplied is already in use');
			} else if (this.responseText == "Invalid email!") {
				toastr.error('The email you supplied is invalid');
				//window.alert('The email you supplied is invalid');
			} else if (this.responseText == "Weak Password, Please try again with a different password.") {
				toastr.error('Your password is too weak');
				//window.alert('Your password is too weak');
			}
			document.getElementById('signupB').disabled = false;
  		}
	});
	xhr.open("POST", "https://espnbetting.mybluemix.net/signUp");
	xhr.setRequestHeader("content-type", "application/json");
	xhr.send(data);
}

function loginButton() {
	document.getElementById('loginB').disabled = true;
	var email = document.getElementById('email').value;
	var passw = document.getElementById('pwd').value;
	var data = JSON.stringify({"username": email, "password": passw});
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", function () {
  		if (this.readyState === 4) {
    		console.log(this.responseText);
			var response = this.responseText;
			toastr.clear();
			if (this.responseText == "User not found!") {
				toastr.error('Couldn\'t Sign in. Incorrect Email');
			} else if (this.responseText == "Wrong Password!") {
				toastr.error('Couldn\'t Sign in. Incorrect Password');
			} else if (response.includes("Success!")) {
				toastr.success(this.responseText);
				sessionStorage.setItem('username', this.responseText);
				document.location.href = "generate/";
			} else {
				toastr.warning("Woah, slow down there cowboy.");
			}
			document.getElementById('loginB').disabled = false;
  		}
	});
	xhr.open("POST", "https://espnbetting.mybluemix.net/authenticate");
	xhr.setRequestHeader("content-type", "application/json");
	xhr.send(data);
}

var selection = 1;

function generateWord() {
	console.log("It enters here!");
	var keywords = document.getElementById('keywords').value;
	var dates = document.getElementById('dates').value;
	var paragraph = document.getElementById('paragraph').value;
	
	var data = JSON.stringify({"main": keywords, "dates": dates, "extra": paragraph});
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", function() {
		if (this.readyState === 4) {
			console.log("Got a response!");
			var response = this.responseText.split(" : ");
			var sCR = Math.floor(Math.random() * 10);
			if (capitalLetters) response[selection] = response[selection].charAt(0).toUpperCase + response[selection].substring(1);
			if (specialCharacters) response[selection] = response[selection] + sC[sCR];
			document.getElementById('password').value = response[selection];
		}
	});
	xhr.open("POST", "https://espnbetting.mybluemix.net/generateRandom");
	xhr.setRequestHeader("content-type", "application/json");
	xhr.send(data);
}

var sC = ['#', '!', '$', '^', '&', '*', '-', '_', '~', '+'];

function setPassword(difficulty) {
	if (difficulty == 'easy')
		selection = 0;
	else if (difficulty == 'medium')
		selection = 1;
	else if (difficulty == 'hard')
		selection = 2;
}

<<<<<<< HEAD
<<<<<<< HEAD
function savePwd() {
	var pw = document.getElementById('password').value;
	db.once('open', function(){
		model.find({user:sessionStorage.getItem("username")},callback);
		if(callback==null){
			var newuser = new model({user:sessionStorage.getItem("username"), passwords[0]:pw});
			newuser.save(function(err, newuser){
				if(err) return console.error(err);
			});
		}else{
			
		}
	});
=======
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

=======
>>>>>>> origin/master
var capitalLetters = false;
var specialCharacters = false;

function modifyPassword(cap) {
	if (cap == 'c')
		capitalLetters = true;
	else if (cap == 's')
		specialCharacters = true;
>>>>>>> origin/master
}