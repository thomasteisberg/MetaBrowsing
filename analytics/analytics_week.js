// Load JQuery (local copy)
jq=document.createElement('script');
jq.src='../lib/jquery-2.1.0.js';
document.getElementsByTagName('head')[0].appendChild(jq);

// Open database
var db = openDatabase('focusHistoryDB', '1.0', 'Page Focus History', 2 * 1024 * 1024);
db.transaction(function (tx) {
	tx.executeSql('DROP TABLE IF EXISTS analyticsWeek');
  tx.executeSql('CREATE TABLE analyticsWeek (taburl string primary key, visits int, sumTime int)');
});

db.transaction(function (tx) {
	var millis = +new Date();
	var weekAgo = Math.round(millis/1000) - (60*60*24*7);
	tx.executeSql('SELECT * FROM raw WHERE timestamp > ' + weekAgo, [], function (tx, results) {
		var len = results.rows.length;
		var lastTimestamp = results.rows.item(0).timestamp;
		for (i = 0; i < len; i++) {
			var ts = results.rows.item(i).timestamp;
			var turl = results.rows.item(i).taburl;
			var elapsedTime = Number(ts) - Number(lastTimestamp);
			lastTimestamp = ts;
			db.transaction(function(lturl, lelapsed){ return function(tx2){
				tx2.executeSql('INSERT OR REPLACE INTO analyticsWeek (taburl, visits, sumTime) VALUES ("'+lturl+'", COALESCE(1+(SELECT visits FROM analyticsWeek WHERE taburl = "'+lturl+'"), 1), COALESCE('+lelapsed+'+(SELECT sumTime FROM analyticsWeek WHERE taburl = "'+lturl+'"), '+lelapsed+'))');

			};}(turl, elapsedTime));
			
		}
  });
});
