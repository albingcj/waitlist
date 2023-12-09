<?php
session_start();

// Clear all session variables
$_SESSION = [];

// Destroy the session
session_destroy();

// Output JSON response
header('Content-Type: application/json');
echo json_encode([
    'status' => 200,
    'message' => 'Session destroyed'
]);

