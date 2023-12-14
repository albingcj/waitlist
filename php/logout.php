<?php
session_start();

// Clear all session variables
$_SESSION = [];

// Destroy the session
if (session_destroy()) {
    echo json_encode([
        'status' => 200,
        'message' => 'Successfully logged out'
    ]);
    return;
} else {
    echo json_encode([
        'status' => 500,
        'message' => 'Something went wrong'
    ]);
    return;
}
