//More javascript - finally!

console.log("update");
var client = new Dropbox.Client({key: "syfz8zk7vubfh3f"});
uploadData();

function uploadData() {
	var datastoreManager = client.getDatastoreManager();
	datastoreManager.openDefaultDatastore(function (error, datastore) {
		if(error) {
			alert('Error opening default datastore' + error);
		}
	});
}

function downloadData() {

}