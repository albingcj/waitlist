<?php
include_once('db.php');
include_once('session.php');
session_start();


function validateCredentials($email, $password)
{
    global $mysqli;
    $query = "SELECT * FROM register WHERE email = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_email'] = $user['email'];
            return true;
        }
    }

    return false;
}



if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userEmail = $_POST['userEmail'];
    $userPwd = $_POST['userPwd'];


    
    $validCredentials = validateCredentials($userEmail, $userPwd);

    if ($validCredentials) {
        $res = [
            'status' => 200,
            'message' => "Login successful",
            // 'email' => $userEmail,
            // 'password' => $userPwd
        ];
        echo json_encode($res);
        return;
    } else {
        $res = [
            'status' => 400,
            'message' => "Incorrect email or password"
        ];
        echo json_encode($res);
        return;
    }
} else {
    $res = [
        'status' => 400,
        'message' => 'Bad Request'
    ];
    echo json_encode($res);
    return;
}