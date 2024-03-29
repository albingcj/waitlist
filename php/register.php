<?php
include_once 'conn.php';

function ifExist($email)
{
    global $db;
    $query = "SELECT * FROM users WHERE email = ?";
    $stmt = mysqli_prepare($db, $query);
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);

    $result = mysqli_stmt_num_rows($stmt) > 0;

    mysqli_stmt_close($stmt);

    return $result;
}

// registering a new user
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['regName'];
    $email = $_POST['regEmail'];
    $password = password_hash($_POST['regPass1'], PASSWORD_DEFAULT); 

    if (ifExist($email)) {
        $data = [
            'status' => '400',
            'message' => 'Email already registered',
        ];
    } else {
        $query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        $stmt = mysqli_prepare($db, $query);
        mysqli_stmt_bind_param($stmt, "sss", $name, $email, $password);
        
        $userlistquery = "INSERT INTO userlist (joinedTables) VALUES ('')";
        $userlistrun = mysqli_query($db, $userlistquery);

        // var_dump( $userlistrun);

        if (mysqli_stmt_execute($stmt) && $userlistrun) {
            $data = [
                'status' => '200',
                'message' => 'Registration successful',
            ];
        } else {
            $data = [
                'status' => '400',
                'message' => 'Registration failed, Try again later',
            ];
        }

        mysqli_stmt_close($stmt);
    }

    echo json_encode($data);
}

?>
