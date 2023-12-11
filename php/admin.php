<?php
include_once("conn.php");

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $query = "SELECT * FROM accordion";
    $result = mysqli_query($db, $query);
    $rows = array();
    while ($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    echo json_encode($rows);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['waitName'])) {
        $waitName = $_POST['waitName'];
        $waitProductId = $_POST['waitProductId'];
        $waitSub = $_POST['waitSub'];
        $waitDesc = $_POST['waitDesc'];
    
        // Fetch the maximum id from the accordion table
        $query = "SELECT MAX(id) FROM accordion";
        $result = mysqli_query($db, $query);
        $row = mysqli_fetch_array($result);
        $tableId = $row[0] + 1;
    
        // Create a new table
        $createTableQuery = "
            CREATE TABLE `table$tableId` (
              `id` int(11) NOT NULL AUTO_INCREMENT,
              `userid` int(11) NOT NULL,
              `name` varchar(255) NOT NULL,
              `count` int(11) NOT NULL DEFAULT 100,
              `flag` int(11) NOT NULL DEFAULT 0,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        ";
    
        // Execute the create table query
        $run = mysqli_query($db, $createTableQuery);
        if ($run) {
            // Insert the data into the accordion table
            $insertQuery = "INSERT INTO accordion (name, type, subhead, content) VALUES ('$waitName', '$waitProductId', '$waitSub', '$waitDesc')";
            $run = mysqli_query($db, $insertQuery);
            if ($run) {
                $res = array(
                    "status" => 200,
                    "message" => "Waitlist created successfully"
                );
            } else {
                $res = array(
                    "status" => 400,
                    "message" => "Error while inserting data into accordion table"
                );
            }
        } else {
            $res = array(
                "status" => 500,
                "message" => "Error while creating table"
            );
        }
    
        echo json_encode($res);
    }
    
}
