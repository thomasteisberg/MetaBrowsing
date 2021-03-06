// Load JQuery (local copy)
jq=document.createElement('script');
jq.src='../lib/jquery-2.1.0.js';
document.getElementsByTagName('head')[0].appendChild(jq);

// Open database
var db = openDatabase('focusHistoryDB', '1.0', 'Page Focus History', 2 * 1024 * 1024);

// Response function that displays data sent from the background page
processData = function (response) {
		$('#history-container').empty(); // Clear the old listing
		for(var p = 0; p < response.historyLog.length; p++){
			$('#history-container').append(
				'<div class="entry"><div class="timestamp">'
					+ response.historyLog[p].timestamp + '</div>'
					+ response.historyLog[p].taburl + "</div>");
		}
	};
	
loadFromDb = function () {

  db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM raw', [], function (tx, results) {
			$('#history-container').empty(); // Clear the old listing
			var len = results.rows.length, i;
			for (i = 0; i < len; i++) {
		  	$('#history-container').append(
				'<div class="entry"><div class="timestamp">'
					+ results.rows.item(i).timestamp + '</div>'
					+ results.rows.item(i).taburl + "</div>");
			}
    });
  });
}

// Wait for the window to be loaded so we know jQuery is available
window.onload = function() {
	 
	// Create a container for the history listig
	$('body').append('<div id="history-container"></div>');
	 
	// On page load request data
	$(document).ready(function() {
		  //chrome.runtime.sendMessage({type: "cacheDataReq"}, processData);
		  loadFromDb();
	}); 
	// Also request data on page focus (i.e. when you return to this tab)
	$(window).focus(function() {
			//console.log("focus");
		  //chrome.runtime.sendMessage({type: "cacheDataReq"}, processData);
		  loadFromDb();
	}); 

}
