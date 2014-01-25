// Load JQuery (local copy)
jq=document.createElement('script');
jq.src='../lib/jquery-2.1.0.js';
document.getElementsByTagName('head')[0].appendChild(jq);

createCSV("www.facebook.com");

function createCSV(startSite) {
	var db = openDatabase('focusHistoryDB', '1.0', 'Page Focus History', 2 * 1024 * 1024);

	var sequence = new Array();

	db.transaction(function (tx) {
		tx.executeSql("SELECT taburl FROM raw", [], function (tx, results) {
			for(var i = 0;i < results.rows.length;i++)
			{
				var row = results.rows.item(i);
				sequence.push(row.taburl);
			}
			fuckThaPolice(sequence, startSite);
		});
	});
}

function fuckThaPolice(sequence, startSite)
{
	//faking my way through a map here...

	var csv = {};
	var n = 5;
	currentPath = "";
	currentPathWordLength = 0;
	for(i = 0;i < sequence.length;i++)
	{
		//starting and ending chains
		if(sequence[i] == startSite)
		{
			if(currentPathWordLength == 0)
			{
				//start a new sequence
				currentPath += sequence[i];
				currentPathWordLength++;
			}
			else
			{
				//we've reached a loop/the end of a chain
				if(csv[currentPath] == null)
				{
					csv[currentPath] = 1;
				}
				else
				{
					csv[currentPath]++;
				}

				currentPathWordLength = 1;
				currentPath = startSite;
				//i--; //consider the startSite again
			}
		}
		else
		{
			if(currentPathWordLength > 0 && currentPathWordLength < n)
			{
				//if there's already a chain going
				currentPath += "-" + sequence[i];
				currentPathWordLength++;
			}
			else if(currentPathWordLength == n)
			{
				if(csv[currentPath] == null)
				{
					csv[currentPath] = 1;
				}
				else
				{
					csv[currentPath]++;
				}
				currentPathWordLength = 0;
				currentPath = "";
			}
		}
	}
	console.log(csv);
	generateCSVText(csv);
}

function generateCSVText(csv) {

}