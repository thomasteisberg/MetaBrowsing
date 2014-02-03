// Open database
var db = openDatabase('focusHistoryDB', '1.0', 'Page Focus History', 2 * 1024 * 1024);

db.transaction(function (tx) {
	if(confirm('Do you really want to delete all your META data?')){
		tx.executeSql('DROP TABLE IF EXISTS analytics');
		tx.executeSql('DROP TABLE IF EXISTS raw');
		tx.executeSql('CREATE TABLE IF NOT EXISTS raw (timestamp int, taburl string)');
		tx.executeSql('CREATE TABLE analytics (taburl string primary key, visits int, sumTime int)');
		alert('Data cleared.');
		window.location = "visualization/index.html";
	}else{
	  window.location = "preferences.html";
	}
});
