// Load JQuery (local copy)
jq=document.createElement('script');
jq.src='../lib/jquery-2.1.0.js';
document.getElementsByTagName('head')[0].appendChild(jq);

// Run analytics
alyt=document.createElement('script');
alyt.src='../analytics/analytics_week.js';
document.getElementsByTagName('head')[0].appendChild(alyt);

var emailbody = "";

// Open database

sendEmail = function(){

	var db = openDatabase('focusHistoryDB', '1.0', 'Page Focus History', 2 * 1024 * 1024);
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM analyticsWeek ORDER BY sumTime DESC', [], function (tx, results) {
				emailbody += '<p>This week, you\'ve wasted the most time on these websites:</p>';
				for(var i=0; i<5; i++){
					emailbody += '<p style="background-color:#4188d2; color: white; margin: 10px; padding: 10px;"><b>';
					emailbody += results.rows.item(i).taburl + "</b> - " + Math.round(results.rows.item(i).sumTime/60) + " minutes over "+results.rows.item(i).visits+" visits.</p>";
				}
				emailbody += '<p>- team|meta</p>';
				$.post("https://api.sendgrid.com/api/mail.send.json",
					{ api_user: "tteisberg", api_key: "digitaltea",
						to:"teisberg@stanford.edu", toname: "Meta User",
						subject:"This week's procrastination report", html:emailbody,
						from: "meta@meta"} );
			});
	});
}
