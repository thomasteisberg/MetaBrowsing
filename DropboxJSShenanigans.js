//Javascript goes here.
//Much good.

linkToDropbox();


function linkToDropbox() {
	console.log("working");

	//Dropbox - create a client
	//key determines for which app
	var client = new Dropbox.Client({key: "syfz8zk7vubfh3f"});

	//Try to finish OAuth authorization
	if(!client.isAuthenticated()) {
		client.authenticate({interactive: true}, function (error) {
			if(error) {
				alert('Authentication error:' + error);
			}
		});
	}
	//client.authenticate();

	//client.signOut();

	/*if(client.isAuthenticated()) {
		//Client is authenticated.  Display UI.
		console.log("authenticated");
	}*/

	//createDataStore(client);
}

function createDataStore(client) {
	var datastoreManager = client.getDatastoreManager();
	datastoreManager.openDefaultDatastore(function (error, datastore) {
		if(error) {
			alert('Error opening default datastore' + error);
		}
	});
}