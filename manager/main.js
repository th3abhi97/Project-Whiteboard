var xmlHttp = new XMLHttpRequest();
xmlHttp.onload = function() {
    var token = xmlHttp.responseText;
    console.log("token : " + token);
    // Authenticate
    firebase.auth().signInWithCustomToken(token).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode +  " : " + errorMessage);
    });
}
// false for synchronous request
xmlHttp.open("GET", "auth.php", true);
xmlHttp.send(null);
