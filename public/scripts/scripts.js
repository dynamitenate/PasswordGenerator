/*eslint-env node, browser*/
/*globals toastr data*/

toastr.options.closeButton = true;

function login() {
	document.getElementById('pwd').onkeypress = function(e) {
		if (!e) e = window.Event;
		var keyCode = e.keyCode || e.which;
		if (keyCode == '13') {
			loginButton();
			return false;
		}
	}
}

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
				var something = this.responseText.substring(this.responseText.indexOf(' ') + 1, this.responseText.indexOf('@'));
				sessionStorage.setItem('username', something);
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
	keywords=keywords.replace(/\s/g, "");
	var dates = document.getElementById('dates').value;
	dates=dates.replace(/\s/g, "");
	var paragraph = document.getElementById('paragraph').value;
	var data = JSON.stringify({"main": keywords, "dates": dates, "extra": paragraph});
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", function() {
		if (this.readyState === 4) {
			console.log("Got a response!");
			var response = this.responseText.split(" : ");
			var sCR = Math.floor(Math.random() * 10);
			var fCL = response[selection];
			var fCLF = fCL.charAt(0).toUpperCase() + fCL.substring(1);
			if (capitalLetters) response[selection] = fCLF;
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

function savePwd() {
	var pw = document.getElementById('password').value;
	sessionStorage.setItem('pwd', pw);
	document.location.href = '/profile';
}

var capitalLetters = false;
var specialCharacters = false;

function addPassword(){
	var pass = document.getElementById('password').value;
	var user = document.getElementById('username').value;
	var service = document.getElementById('service').value;
	if (pass === null || user === null || service === null){
		toastr.error('All fields must be filled in');
		return;
	}
	var table = document.getElementById("table");
	var row = table.insertRow(1);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	cell1.innerHTML = service;
	cell2.innerHTML = user;
	cell3.innerHTML = pass;
	var currentUser = sessionStorage.getItem("username");
	var data = JSON.stringify({"user": currentUser, "website": service, "username": user, "password": pass});
	console.log(data);
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", function() {
		if (this.readyState === 4) {
			console.log(this.responseText);
		}
	});
	xhr.open("POST", "https://espnbetting.mybluemix.net/addEntry");
	xhr.setRequestHeader("content-type", "application/json");
	xhr.send(data);
}

function modifyPassword(cap) {
	if (cap == 'c') {
		if (capitalLetters)
			capitalLetters = false;
		else
			capitalLetters = true;
	} else if (cap == 's') {
		if (specialCharacters)
			specialCharacters = false;
		else
			specialCharacters = true;
	}
}

function logout() {
	sessionStorage.removeItem("username");
	document.location.href = "../index.html";
}