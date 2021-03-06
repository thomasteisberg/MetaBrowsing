// Load JQuery (local copy)
jq=document.createElement('script');
jq.src='../lib/jquery-2.1.0.js';
document.getElementsByTagName('head')[0].appendChild(jq);

createCSV = function(startSite) {
	var db = openDatabase('focusHistoryDB', '1.0', 'Page Focus History', 2 * 1024 * 1024);

	var sequence = new Array();

	db.transaction(function (tx) {
		tx.executeSql("SELECT taburl FROM raw", [], function (tx, results) {
			for(var i = 0;i < results.rows.length;i++)
			{
				var row = results.rows.item(i);
				url = row.taburl;
				sequence.push(url);
			}
			var csvfile = fuckThaPolice(sequence, startSite);
			chrome.runtime.sendMessage({type: "csvData", csvfile: csvfile});
		});
	});
};

function fuckThaPolice(sequence, startSite)
{
	//faking my way through a map here...

	var csv = {};
	var n = 10;
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
				currentPath += "|" + "end"
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
				currentPath += "|" + sequence[i];
				currentPathWordLength++;
			}
			else if(currentPathWordLength == n)
			{
				currentPath += "|" + "end";
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
	return generateCSVText(csv);
}

function generateCSVText(csv) {
	var csvfile = "";
	for(var index in csv) {
  	csvfile += index + "," + csv[index] + "\n";
  }
  return csvfile;
}
