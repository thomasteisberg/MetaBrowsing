// Open database
var db = openDatabase('focusHistoryDB', '1.0', 'Page Focus History', 2 * 1024 * 1024);

db.transaction(function (tx) {
	if(confirm('Do you really want to delte all your META data? (ha.) Thomas will be very sad...')){
		tx.executeSql('DROP TABLE IF EXISTS analytics');
		tx.executeSql('DROP TABLE IF EXISTS raw');
		alert('Thomas is sad.');
		alert("It's your fault, you know.");
		alert("Don't you feel guilty?");
	}
});
