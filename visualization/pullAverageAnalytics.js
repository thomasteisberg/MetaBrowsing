// Load JQuery (local copy)
jq=document.createElement('script');
jq.src='../lib/jquery-2.1.0.js';
document.getElementsByTagName('head')[0].appendChild(jq);

getTopSiteData();

function getTopSiteData() {
	//This function pulls from the 'analytics' SQLite database
	//It returns an array of sites visited and the number of times
	//they were visited, sorted descending.
	var siteTime = new Array();

	var db = openDatabase('focusHistoryDB', '1.0', 'Page Focus History', 2 * 1024 * 1024);

	db.transaction(function (tx) {
		tx.executeSql("SELECT * FROM analytics ORDER BY sumTime DESC LIMIT 10", [], function (tx, results) {
			for(var i = 0;i < results.rows.length;i++) {
				var row = results.rows.item(i);
				var visits = row.visits;
				var time = row.sumTime;
				var avg = parseInt(time)/parseInt(visits)/100;
				var subArray = [avg, row.taburl];
				siteTime.push(subArray);
				console.log(siteTime[i]);
			}
			console.log(siteTime);
			buildGraph(siteTime);
		});
	});

}

function largest_val(matrix) {
    var x = 0;
    for (i = 0; i < matrix.length; ++i) {
        if (x < matrix[i][0]) {
            x = matrix[i][0];
        }
    }
    return x;
}

function buildGraph(data) {

var x = d3.scale.linear()
    .domain([0, largest_val(data)])
    .range([0, 960]);

d3.select(".sitenames")
  .selectAll("h4")
    .data(data)
  .enter().append("h4")
    .text(function(d) { return d[1]; });

d3.select(".chart")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .transition().duration(1200)
    .style("width", function(d) {return x(d[0]) + "px";} )
    .text(function(d) {return (Math.round(d[0] * 100) / 100) + " s";});

}