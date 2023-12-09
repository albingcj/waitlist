<?php
session_start();
// If the user is not logged in redirect to the login page...
if (isset($_SESSION['email'])) {
    $email = $_SESSION['email'];
    $name = $_SESSION['name'];
    $res = [
        'status' => 200,
        'message' => "Session set",
        'email' => $email,
        'name'  => $name
    ];
} else {
    $res = [
        'status' => 400,
        'message' => "Session not set"
    ];
}

// echo '<script>console.log(' . $_SESSION['email'] . ');</script>';

echo json_encode($res);
