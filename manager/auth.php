<?php
  require_once 'php-jwt/src/BeforeValidException.php';
  require_once 'php-jwt/src/ExpiredException.php';
  require_once 'php-jwt/src/SignatureInvalidException.php';
  require_once 'php-jwt/src/JWT.php';

  use \Firebase\JWT\JWT;

  // Get your service account's email address and private key from the JSON key file
  $service_account_email = "service_account_email";
  $private_key = "private_key";

  // Check if the user is logged in
  $uid = $_SERVER['REMOTE_USER'];
  if(isset($uid)) {
    create_custom_token($uid);
  } else {
    die("AUTH FAILURE");
  }

  function create_custom_token($uid) {
    global $service_account_email, $private_key;

    $now_seconds = time();
    $payload = array(
      "iss" => $service_account_email,
      "sub" => $service_account_email,
      "aud" => "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
      "iat" => $now_seconds,
      "exp" => $now_seconds+(60*60),  // Maximum expiration time is one hour
      "uid" => $uid
    );
    echo JWT::encode($payload, $private_key, "RS256");
  }
?>
