// Load JQuery (local copy)
jq=document.createElement('script');
jq.src='../lib/jquery-2.1.0.js';
document.getElementsByTagName('head')[0].appendChild(jq);

// Open database
var db = openDatabase('focusHistoryDB', '1.0', 'Page Focus History', 2 * 1024 * 1024);
	
loadFromDb = function () {

  db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM raw ORDER BY timestamp DESC', [], function (tx, results) {
			//$('#history-container').empty(); // Clear the old listing
			var len = results.rows.length, i;
			for (i = 0; i < len; i++) {
				var date = new Date(results.rows.item(i).timestamp * 1000);
				var month = twoDigits(date.getMonth() + 1);
				var day = twoDigits(date.getDate());
				var year = date.getFullYear();
				var hour = twoDigits(date.getHours());
				var minutes = twoDigits(date.getMinutes());
				$('.data').append(
					month + ":" + day + ":" + year + "  "
						+ hour + ":" + minutes + "    |" +
						results.rows.item(i).taburl + "<br>");
			}
    });
  });
}

function twoDigits(num)
{
	n = String(num);
	if(n.length < 2)
		n = "0" + n;
	return n;
}

// Wait for the window to be loaded so we know jQuery is available
window.onload = function() {
	 
	 
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
