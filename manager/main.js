"use strict";

// Globally accessible variables
var my_events_button = document.getElementById("my-events-button");
var all_events_button = document.getElementById("all-events-button");
var my_events = document.getElementById("my-events");
var all_events = document.getElementById("all-events");
var user_details = null;

// Perform all initial steps here
window.onload = function() {
    all_events_button.onclick = function() {
        hide(my_events);
        show(all_events);
    }
    my_events_button.onclick = function() {
        hide(all_events);
        show(my_events);
    }
    authenticate();
}

// Authenticate the user
function authenticate() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = function() {
        if (xmlHttp.status == 200) {
            var token = xmlHttp.responseText;
            hide(document.getElementById("loading-modal"));
            firebase.auth().signInWithCustomToken(token)
            .then(function(success){
                console.log(success);
                getData("/users/" + success.uid, setUserDetails);
                successAuth();
            }, function(error) {
                console.log(error);
                failureAuth(error);
            });
        }
    }
    // False for synchronous request
    xmlHttp.open("GET", "auth.php", false);
    xmlHttp.send(null);
}

// Events to occur if auth succeeds
function successAuth() {
    // Do some shenanigns
    getData("events/", populateEventData);
}

// Events to occur if auth fails.
function failureAuth(error) {
    var auth_error = document.getElementById("auth-error");

    // handle dom with error message
    auth_error.append(document.createTextNode(error.code));
    var p = document.createElement("p");
    p.append(document.createTextNode(error.message));
    auth_error.append(p);

    hide(my_events);
    hide(all_events);
    show(auth_error);
}

// Populate event data in correct id's
function populateEventData(events) {
    // Makes sure user_details are set or assume auth failed
    if (user_details == null) return;
    // Pre-compile the template
    var source = fetchSource("templates/event-card-template.html");
    var template = Handlebars.compile(source);
    // Empty out the inner html
    my_events.innerHTML = "";
    all_events.innerHTML = "";
    for (var curEvent in events){
        // Construct the card data
        var card = {
            title: events[curEvent].name,
            description: events[curEvent].description
        };
        // Check if we need to push the card on my-events
        if (events[curEvent].group_name === user_details.group_name) {
            createCard(card, template, my_events);
        }
        createCard(card, template, all_events);
    }
}

// Create an event data card
function createCard(card, template, binder) {
    var parser = new DOMParser();
    var html = parser.parseFromString(template(card), "text/xml");
    binder.append(html.firstChild);
}

// Get data from firebase database
function getData(node, callback) {
    var data = firebase.database().ref(node);
    data.on("value", function(snap){
        callback(snap.val());
    });
}

// Fetch the source html to be used with Handlebars
function fetchSource(url) {
    var rawSource = "";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            rawSource = xmlHttp.response;
        }
    }
    xmlHttp.open("GET", url, false);
    xmlHttp.send();
    return rawSource;
}

// saves the user details as a global variable
function setUserDetails(data) {
    var uid = firebase.auth().currentUser.uid;
    user_details = {
        uid: uid,
        group_name: data.group_name
    };
}

// Hide the given element
function hide(element) {
    element.classList.add("hidden");
}

// Unhide/show the given element
function show(element) {
    element.classList.remove("hidden");
}
