<?php
include_once("conn.php");
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['tableid'])) {

        $tableid = $_GET['tableid'];
        $query = "SELECT * FROM accordion WHERE id = '$tableid'";
        $result = mysqli_query($db, $query);
        $res = $result->fetch_assoc();
        if ($res) {
            $data = [
                'status' => 200,
                'id' => $res['id'],
                'name' => $res['name'],
                'type' => $res['type'],
                'subhead' => $res['subhead'],
                'content' => $res['content'],
            ];
        }else{
            $data = [
                'status' => 400,
                'message' => "Table id not found"
            ];
        }
        echo json_encode($data);
    } else {

        $query = "SELECT * FROM accordion ORDER BY id DESC";
        $result = mysqli_query($db, $query);
        $data = array(); // Initialize $data array

        while ($r = mysqli_fetch_assoc($result)) {

            $linkshared = $r['total'] - $r['queue'];
            $rowData = array(
                'id' => $r['id'],
                'name' => $r['name'],
                'type' => $r['type'],
                'linkshared' => $linkshared,
                'queue' => $r['queue'],
                'total' => $r['total'],
            );

            $data[] = $rowData;
        }

        echo json_encode($data);
    }
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
    if(isset($_POST['editName'])){
        $ename = $_POST['editName'];
        $etype = $_POST['editType'];
        $esub = $_POST['editSub'];
        $edesc = $_POST['editCont'];
        $tableid = $_POST['idx'];

        $query = "UPDATE accordion SET name = '$ename', type = '$etype', subhead = '$esub', content = '$edesc' WHERE id = '$tableid'";
        $result = mysqli_query($db, $query);
        if($result){
            $res = array(
                "status" => 200,
                "message" => "Accordion updated successfully"
            );
        }else{
            $res = array(
                "status" => 400,
                "message" => "Error while updating accordion"
            );
        }
        echo json_encode($res);
        return;
    }
}
