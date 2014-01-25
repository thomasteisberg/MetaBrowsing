function getTopSiteData() {
        //This function pulls from the 'analytics' SQLite database
        //It returns an array of sites visited and the number of times
        //they were visited, sorted descending.
        var siteVisits = [];

        var db = openDatabase('focusHistoryDB', '1.0', 'Page Focus History', 2 * 1024 * 1024);

        db.transaction(function (tx) {
                tx.executeSql("SELECT * FROM analytics ORDER BY visits DESC LIMIT 10", [], function (tx, results) {
                        console.log("hiya");
                        for(var i = 0;i < results.rows.length;i++) {
                                var row = results.rows.item(i);
                                var subArray = [row.visits, row.taburl];
                                siteVisits.push(subArray);
                                console.log(siteVisits[i]);
                        }
                });
        });

        return siteVisits;
}

var data = getTopSiteData();

// but actually, the data will come from a server query

var data_copy = data;

var x = d3.scale.linear()
    .domain([0, 18])
    .range([0, 960]);

d3.select(".sitenames")
  .selectAll("h4")
    .data(data)
  .enter().append("h4")
    .text(function(d) { return d[1]; });

d3.select(".chart")
  .selectAll("div")
    .data(data_copy)
  .enter().append("div")
    .transition().duration(1200).delay(200)
    .style("width", function(d) {return x(d[0]) + "px";} )
    .text(function(d) {return d[0];});

