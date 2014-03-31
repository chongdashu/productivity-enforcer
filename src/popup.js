var app=this;
var active=true;

// Init function
function init() {
  console.log("init()");

  var addButton = document.getElementById('blocklist_add_button');
  var addButtonCallback = this.onBlocklistAdd;
  addButton.addEventListener('click', addButtonCallback, false);

  var removeButton = document.getElementById('blocklist_listing_button');
  var removeButtonCallback = this.onBlocklistRemove;
  removeButton.addEventListener('click', removeButtonCallback, false);

  var statusButton = document.getElementById("blocklist_status_button");
  var statusButtonCallback = this.onStatusButtonClick;
  statusButton.addEventListener('click', statusButtonCallback, false);

  app.loadBlocklist();
  app.loadStatus();
  app.refresh();
}

function loadStatus() {
  console.log("loadStatus()");
    if (localStorage['status']) {
      active = localStorage['status'] === "true";
    }
    else {
      active = false;
    }
}

function refresh() {
    console.log("refresh()");

    var statusLabel = document.getElementById("blocklist_status_label");
    statusLabel.setAttribute("class",active ? "active" : "inactive");
    statusLabel.innerHTML = active ? "Active" : "Inactive";

    var statusButton = document.getElementById("blocklist_status_button");
    statusButton.innerHTML = active ? "Turn Off" : "Turn On";

    refreshBackgroundPage();
}

function onStatusButtonClick() {
  app.active = !active;
  localStorage['status'] = active;

  app.refresh();
}

function refreshBackgroundPage() {
  console.log("refreshBackgroundPage()");
  var bgPage = chrome.extension.getBackgroundPage();
  bgPage.refresh();
}

// Add a term to the blocked list.
function addTermToBlocklist(term) {
  console.log("addTermToBlocklist(), term=%s", term);

  var select = document.getElementById("blockedlist_listing_select");
  select.add(new Option(term, term));
}

function onBlocklistAdd(e) {
  console.log("onBlocklistAdd(%o)", e);

  var input = document.getElementById("blocklist_add_input");
  var term = input.value;
  if (term.length > 0) {
    app.addTermToBlocklist(term);
  }

  input.value = "";

  app.saveBlocklist();
  app.refreshBackgroundPage();
}

function onBlocklistRemove(e) {
  console.log("onBlocklistRemove(%o", e);

  var select = document.getElementById("blockedlist_listing_select");
    
  for (i = select.length - 1; i>=0; i--) {
    if (select.options[i].selected) {
      select.remove(i);
    }
  }

  app.saveBlocklist();
}

function saveBlocklist() {
  console.log("saveBlocklist()");

  var select = document.getElementById("blockedlist_listing_select");
  var options = select.options;

  var terms = [];
  for (var i=0; i<options.length; i++){
    terms.push(options[i].value);
  }

  localStorage['blocklist'] = JSON.stringify(terms);

}

function loadBlocklist() {
  console.log("loadBlocklist()");

  if (localStorage['blocklist']) {
    var terms = JSON.parse(localStorage['blocklist']);
    for (var i=0; i<terms.length; i++) {
      app.addTermToBlocklist(terms[i]);
    }
  }
}

// Methods to be run upon loading of DOM content. 
document.addEventListener('DOMContentLoaded', function () {
  init();

});
