// Settings
var QUERY_FREQUENCY = 100; // How often (in ms) to query the current tab
var FOCUS_TIME = 1000; // How long (in ms) should the user be looking at a
										// page before it counts as them switching to it

// Temporary log of timestamps and tabs visited
var historyLog = new Array();

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
	
	// Track when focus switched to this page
	if(tabs[0].url != lastUrlSeen){
		lastUrlSeen = tabs[0].url;
		lastUrlFocusBeginning = millis;
	}
	
	// Only save the current tab information if the user has changed tabs
	// and they have been on this tab for at least 2 seconds
	if(millis - lastUrlFocusBeginning > FOCUS_TIME &&
			(historyLog.length == 0 ||
				tabs[0].url != historyLog[historyLog.length - 1].taburl)){
		historyLog[historyLog.length] = {taburl: tabs[0].url, timestamp: Math.round(lastUrlFocusBeginning/1000)};
		// Timestamp stored as a unix style timestamp
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
getPage();

// Link button click to opening the raw data display page (probably temporary)
chrome.browserAction.onClicked.addListener(function(activeTab)
{
    chrome.tabs.create({ url: "rawdata.html" });
});

// Handle requests for the data from other parts of the extension
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.type == "cacheDataReq")
      sendResponse({historyLog: historyLog});
  });
