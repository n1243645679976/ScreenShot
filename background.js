chrome.commands.onCommand.addListener(
	function(command){
		console.log(command);
		if(command == 'capture'){
			chrome.tabs.query({currentWindow: true, active: true},
				function(tabs){
					chrome.tabs.sendMessage(tabs[0].id, {message: "***capture***"})
			});
		}
	}
);