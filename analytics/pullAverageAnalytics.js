// Load JQuery (local copy)
jq=document.createElement('script');
jq.src='../lib/jquery-2.1.0.js';
document.getElementsByTagName('head')[0].appendChild(jq);

getTopSiteData();

function getTopSiteData() {
	//This function pulls from the 'analytics' SQLite database
	//It returns an array of sites visited and the number of times
	//they were visited, sorted descending.
	var siteTime = [];

	var db = openDatabase('focusHistoryDB', '1.0', 'Page Focus History', 2 * 1024 * 1024);

	db.transaction(function (tx) {
		tx.executeSql("SELECT * FROM analytics ORDER BY sumTime DESC LIMIT 10", [], function (tx, results) {
			for(var i = 0;i < results.rows.length;i++) {
				var row = results.rows.item(i);
				var visits = row.visits;
				var time = row.sumTime;
				var avg = parseInt(time)/parseInt(visits)/1000;
				var subArray = [avg, row.taburl];
				siteTime.push(subArray);
				console.log(siteTime[i]);
			}
		});
	});

	return siteTime;
}
