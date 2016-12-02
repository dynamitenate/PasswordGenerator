function signupButton() {
	var email = document.getElementById('emailSU').value;
	var pass1 = document.getElementById('pwdSU').value;
	var pass2 = document.getElementById('cpwd').value;
	if (pass1.localeCompare(pass2) != 0) {
		window.alert("Passwords do not match");
		return;
	}
	var data = JSON.stringify({"username": email, "password": pass1});
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", function () {
  		if (this.readyState === 4) {
			console.log(this.responseText);
			if (this.responseText === "success")
				toastr.success('Successfully signed up! Click on the Log In button to continue');
			else
				toastr.error('Couldn\'t Sign Up. Error!')
  		}
	});
	xhr.open("POST", "http://espnbetting.mybluemix.net/signup");
	xhr.setRequestHeader("content-type", "application/json");
	xhr.send(data);
	window.alert("Request Sent");
}

function loginButton() {
	var email = document.getElementById('email').value;
	var passw = document.getElementById('pwd').value;
	var data = JSON.stringify({"username": email, "password": passw});
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", function () {
  		if (this.readyState === 4) {
    		console.log(this.responseText);
			if (this.responseText === "") {
				toastr.error('Couldn\'t Sign in. Incorrect Email or Password');
			} else {
				toastr.success('Signed In!');
				localStorage.setItem('username', this.responseText);
			}
  		}
	});
	xhr.open("POST", "http://espnbetting.mybluemix.net/authenticate");
	xhr.setRequestHeader("content-type", "application/json");
	xhr.send(data);
	window.alert("Request Sent");
}