$("#emailSelection").submit(function(){
	dropdown = document.getElementById("dropdown");
	chrome.storage.local.set({'emailBool': dropdown.value}, function() {
		chrome.storage.local.set({'email': email.value}, function () {
			document.getElementById('alerttext').innerHTML = "Your preferences have been saved!<br>";
			document.getElementById('homelink').innerHTML = "Click <a href='../visualization/index.html'>here</a> to return home!";
		});
	});
	return false;
});

/*function checkValue()
{
	chrome.storage.local.get('email', function (items) {
			console.log(items['email']);
	});
}*/