<?php
session_start();

// Clear all session variables
$_SESSION = [];

session_destroy();

return [
    'status' => 200,
    'message' => "Session destroyed"
];
