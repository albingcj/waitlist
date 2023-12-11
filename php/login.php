<?php
include_once('conn.php');
session_start();

function checkAdmin($email, $password)
{
    global $db;
    $query = "SELECT * FROM admin WHERE email = ? AND password = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param('ss', $email, $password);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        $_SESSION['email'] = $user['email'];
        $_SESSION['name'] = $user['name'];
        $_SESSION['userid'] = $user['id'];
        return true;
    }
    return false;
}



function checkExist($email)
{
    global $db;
    $query = "SELECT * FROM users WHERE email = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        return true;
    } else {
        return false;
    }
}


function validateCredentials($email, $password)
{
    global $db;
    $query = "SELECT * FROM users WHERE email = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        if (password_verify($password, $user['password'])) {
            $_SESSION['email'] = $user['email'];
            $_SESSION['name'] = $user['name'];
            $_SESSION['userid'] = $user['id'];
            return true;
        }
    }

    return false;
}



if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userEmail = $_POST['logEmail'];
    $userPwd = $_POST['logPass'];


    if (checkAdmin($userEmail, $userPwd)) {
        $res = [
            'status' => 207,
            'message' => "Login successful",
            'email' => $userEmail,
        ];
        // redirect to admin.html

        echo json_encode($res);
        return;
    } else {


        //checks if the user exists in the database
        //if not return error
        if (checkExist($userEmail) == false) {
            $res = [
                'status' => 400,
                'message' => "Email does not exist",
            ];
            echo json_encode($res);
            return;
        }

        // Else continue operations
        $validCredentials = validateCredentials($userEmail, $userPwd);

        if ($validCredentials) {
            $res = [
                'status' => 200,
                'message' => "Login successful",
                'email' => $userEmail,
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
    }
} else {
    $res = [
        'status' => 400,
        'message' => 'Bad Request'
    ];
    echo json_encode($res);
    return;
}
