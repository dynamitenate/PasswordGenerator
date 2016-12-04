function signupButton() {
	var email = document.getElementById('emailSU').value;
	var pass1 = document.getElementById('pwdSU').value;
	var pass2 = document.getElementById('cpwd').value;
	if (pass1.localeCompare(pass2) != 0) {
		toastr.error('Your passwords do not match');
		return;
	}
	var data = JSON.stringify({"username": email, "password": pass1});
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", function () {
  		if (this.readyState === 4) {
			console.log(this.responseText);
			if (this.responseText == "User Created!")
				toastr.success('Successfully signed up! Click on the Log In button to continue');
			else if (this.responseText == "Email already in use!")
				toastr.error('The email you supplied is already in use');
			else if (this.responseText == "Invalid email!")
				toastr.error('The email you supplied is invalid');
			else if (this.responseText == "Weak Password, Please try again with a different password.")
				toastr.error('Your password is too weak');
  		}
	});
	xhr.open("POST", "http://localhost:6005/signUp");
	xhr.setRequestHeader("content-type", "application/json");
	xhr.send(data);
}

function loginButton() {
	var email = document.getElementById('email').value;
	var passw = document.getElementById('pwd').value;
	var data = JSON.stringify({"username": email, "password": passw});
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", function () {
  		if (this.readyState === 4) {
    		console.log(this.responseText);
			if (this.responseText == "User not found!") {
				toastr.error('Couldn\'t Sign in. Incorrect Email');
			} else if (this.responseText == "Wrong Password!") {
				toastr.error('Couldn\'t Sign in. Incorrect Password');
			} else {
				toastr.success('Signed In!');
				localStorage.setItem('username', this.responseText);
			}
  		}
	});
	xhr.open("POST", "http://localhost:6005/authenticate");
	xhr.setRequestHeader("content-type", "application/json");
	xhr.send(data);
}