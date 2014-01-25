getTopSiteData();

function getTopSiteData() {
        //This function pulls from the 'analytics' SQLite database
        //It returns an array of sites visited and the number of times
        //they were visited, sorted descending.
        var siteVisits = new Array();

        var db = openDatabase('focusHistoryDB', '1.0', 'Page Focus History', 2 * 1024 * 1024);

        db.transaction(function (tx) {
                tx.executeSql("SELECT * FROM analytics ORDER BY visits DESC LIMIT 3", [], function (tx, results) {
                        for(var i = 0;i < results.rows.length;i++) {
                                var row = results.rows.item(i);
                                var subArray = [row.visits, row.taburl];
                                siteVisits.push(subArray);
                                //console.log(siteVisits[i]);
                        }
                        console.log(siteVisits);
                        buildGraph(siteVisits);
                });
                
        }); 
}

<<<<<<< HEAD
function largest_val(matrix) {
    var x = 0;
    for (i = 0; i < matrix.length; ++i) {
        if (x < matrix[i][0]) {
            x = matrix[i][0];
        }
    }
    return x;
}
=======
function buildGraph(data_copy) {

>>>>>>> 0dda7fc827ef17617a122943fc89762408c466e9

<<<<<<< HEAD
=======
>>>>>>> 0dda7fc827ef17617a122943fc89762408c466e9

var x = d3.scale.linear()
    .domain([0, largest_val(data)])
    .range([0, 960]);

d3.select(".sitenames")
  .selectAll("h4")
    .data(data_copy)
  .enter().append("h4")
    .text(function(d) { return d[1]; });

d3.select(".chart")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .transition().duration(1200).delay(200)
    .style("width", function(d) {return x(d[0]) + "px";} )
    .text(function(d) {return d[0];});

}
