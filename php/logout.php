<?php
session_start();

// Clear all session variables
$_SESSION = [];

// Destroy the session
session_destroy();


// header('Content-Type: application/json');
echo json_encode([
    'status' => 200,
    'message' => 'Successfully logged out'
]);

