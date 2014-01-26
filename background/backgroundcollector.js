// Load JQuery (local copy)
jq=document.createElement('script');
jq.src='../lib/jquery-2.1.0.js';
document.getElementsByTagName('head')[0].appendChild(jq);

// Load email parser
jq=document.createElement('script');
jq.src='../visualization/email.js';
document.getElementsByTagName('head')[0].appendChild(jq);

// Settings
var QUERY_FREQUENCY = 100; // How often (in ms) to query the current tab
var FOCUS_TIME = 1000; // How long (in ms) should the user be looking at a
										// page before it counts as them switching to it

// Temporary log of timestamps and tabs visited
var historyLog = new Array();

// WebSQL Database
var db = openDatabase('focusHistoryDB', '1.0', 'Page Focus History', 2 * 1024 * 1024);
db.transaction(function (tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS raw (timestamp int, taburl string)');
});

// The last URL the user was looking at
var lastUrlSeen = "";
// Milliseconds timestamp of when the user started looking at that URL
var lastUrlFocusBeginning = 0;

// Callback for when Chrome responds with the requested current tab
// Checks if the active tab differs from the last active tab and
// stores it if so
// Also schedules the next call to getPage()
var recordPage = function (tabs) {
	// Current timestamp
	var millis = +new Date();
	
	var parser = document.createElement('a');
	parser.href = tabs[0].url;
 
	var parsedurl = parser.hostname.replace('www.', '');

	// Track when focus switched to this page
	if(parsedurl != lastUrlSeen){
		lastUrlSeen = parsedurl;
		lastUrlFocusBeginning = millis;
	}
	
	// Only save the current tab information if the user has changed tabs
	// and they have been on this tab for at least 2 seconds
	if(millis - lastUrlFocusBeginning > FOCUS_TIME &&
			(historyLog.length == 0 ||
				parsedurl != historyLog[historyLog.length - 1].taburl)){
				if(parsedurl != "" && parsedurl != "mlabibnomhfmephibijgghejmmmbigpi"){
					historyLog[historyLog.length] = {taburl: parsedurl, timestamp: Math.round(lastUrlFocusBeginning/1000)};
					db.transaction(function (tx) {
						tx.executeSql('INSERT INTO raw (timestamp, taburl) VALUES (?, ?)', [Math.round(lastUrlFocusBeginning/1000), parsedurl]);
					});
					// Timestamp stored as a unix style timestamp
				}
	}
	
	// Schedule the next tab request
	setTimeout(getPage, QUERY_FREQUENCY);
}

// Requests the active tab from chrome. Response is handled by
// recordPage callback function
var getPage = function () {
	chrome.tabs.query({"active": true, "lastFocusedWindow": true}, recordPage);
}

// Initiate looping getPage -> recordPage -> getPage calls
window.onload = function(){getPage(); emailScheduler();};

// Link button click to opening the raw data display page (probably temporary)
chrome.browserAction.onClicked.addListener(function(activeTab)
{
    chrome.tabs.create({ url: "../visualization/index.html" });
});



// Email handling

var fridayMailSent = false;

emailScheduler = function() {
	d = new Date();
	if(!fridayMailSent && d.getDay() == 5){
		chrome.storage.local.get("emailBool", function(a){
			if(a){
				setTimeout(sendEmail, 1000);
				fridayMailSent = true;
			}
		});
	}else{
		fridayMailSent = false;
	}
	setTimeout(emailScheduler, 1000*60*60*12);
}
