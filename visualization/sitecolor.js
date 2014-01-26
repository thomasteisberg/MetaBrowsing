/*
To use this, add this to the <head>:
<script src="../lib/jquery-2.1.0.js"></script>
<script src="../lib/jquery.embedly.js"></script>
<script src="sitecolor.js"></script>
*/

	$.embedly.extract(['http://techcrunch.com'])
		.progress(function(result){
		  c = result.favicon_colors[0];
		  document.write(c.color[0] + "| " + c.color[1] + "| " + c.color[2]);
		});

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

siteColor = function(url){
	
}
