alert("background page loaded");

recordPage = function (tabs) {
	alert(tabs[0].url);
	setTimeout(getPage, 30000);
}

getPage = function () {
	chrome.tabs.query({"active": true, "lastFocusedWindow": true}, recordPage);
}

getPage();
