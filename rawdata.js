processData = function (response) {
	for(var p = 0; p < response.historyLog.length; p++){
		document.write(response.historyLog[p].taburl + "<br />");
	}
}
  
chrome.runtime.sendMessage({type: "currDataReq"}, processData);
