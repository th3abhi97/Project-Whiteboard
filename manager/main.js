"use strict";

// perform all necessary steps here
window.onload = function() {
    var my_events = document.getElementById("my-events");
    var all_events = document.getElementById("all-events");
    /*my_events.onclick = function() {
        console.log(this);
        var loading_modal = document.getElementById("loading-modal");
        loading_modal.classList.remove("is-active");
    };*/
}

// authenticate the user
function authenticate() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = function() {
        if (xmlHttp.status == 200) {
            var token = xmlHttp.responseText;
            // Authenticate
            firebase.auth().signInWithCustomToken(token).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode +  " : " + errorMessage);
            });
        }
    }
    // False for synchronous request
    xmlHttp.open("GET", "auth.php", false);
    xmlHttp.send(null);
}

// Get data and populate the window
function getData() {

}
