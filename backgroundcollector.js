alert("bg page loaded");

// Temporary log of timestamps and tabs visited
historyLog = new Array();

// Callback for when Chrome responds with the requested current tab
// Checks if the active tab differs from the last active tab and
// stores it if so
// Also schedules the next call to getPage()
recordPage = function (tabs) {
	// Only save the current tab information if the user has changed tabs
	if(historyLog.length == 0 || tabs[0].url != historyLog[historyLog.length - 1].taburl){
		var unixtimestamp = Math.round(+new Date()/1000)
		historyLog[historyLog.length] = {taburl: tabs[0].url, timestamp: unixtimestamp};
	}
	
	// Schedule the next tab request
	setTimeout(getPage, 1000);
}

// Requests the active tab from chrome. Response is handled by
// recordPage callback function
getPage = function () {
	chrome.tabs.query({"active": true, "lastFocusedWindow": true}, recordPage);
}

// Initiate looping getPage -> recordPage -> getPage calls
getPage();
