var active = false;



chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	console.log("onUpdated");
	refresh();
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
	//console.log("onActivated");
	// refresh();
});

function init() {

	refresh();
}

function refreshIcon() {
	console.log("background.refreshIcon()");

	var icon = active ? "icon-active.png" : "icon-inactive.png";

	console.log("active=%s, icon=%s", active, icon);
	chrome.browserAction.setIcon({
		path: icon
	});
}

function refresh() {
	console.log("background.refresh()");

	active = localStorage['status'] === "true";


	console.log("active=%s", active);

	refreshIcon();
	
	if (!active) {
		return;
	}

	chrome.tabs.query({currentWindow : true}, function(tabs){

	var tabIds = [];

	if (localStorage['blocklist']) {
		var terms = JSON.parse(localStorage['blocklist']);

		for (var j=0; j < tabs.length; j++) {
			var tab = tabs[j];
			for (var i=0; i<terms.length; i++) {
				var term = terms[i];
				var url = tab.url;
				var regex = new RegExp(term, "ig");
				var match = tab.url.match(regex);

				console.log("term=%s, url=%s, regex=%s, match=%s", term, url, regex, match);

				if (match) {
					tabIds.push(tab.id);
					break;
				}
			}
		}
	}

		chrome.tabs.remove(tabIds, function() {
			console.log("Removed tabIds=%s", tabIds);
		});
		
	});


}

init();
