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