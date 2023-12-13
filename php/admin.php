<?php
include_once("conn.php");
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['tableid'])) {
        // fetch the data from the accordion table for each accordion content 
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
                'img' => $res['image'],
            ];
        } else {
            $data = [
                'status' => 400,
                'message' => "Table id not found"
            ];
        }
        echo json_encode($data);
    } else {
        // fetch the data from the accordion table for all accordion content in latest ones
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
                'status' => $r['status']
            );

            $data[] = $rowData;
        }

        echo json_encode($data);
    }
}


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['waitName'])) {
        //inserting a new waitlist into the platform
        $waitName = $_POST['waitName'];
        $waitProductId = $_POST['waitProductId'];
        $waitSub = $_POST['waitSub'];
        $waitDesc = $_POST['waitDesc'];
        $waitImg  = $_POST['waitImg'];

        // Fetch the maximum id from the accordion table using prepared statement
        $query = "SELECT MAX(id) FROM accordion";
        $stmt = mysqli_prepare($db, $query);

        if ($stmt) {
            mysqli_stmt_execute($stmt);
            mysqli_stmt_bind_result($stmt, $maxId);
            mysqli_stmt_fetch($stmt);
            mysqli_stmt_close($stmt);

            $tableId = $maxId + 1;

            // Insert the data into the accordion table using prepared statement
            $insertQuery = "INSERT INTO accordion (name, type, subhead, content, image) VALUES (?, ?, ?, ?, ?)";
            $stmt = mysqli_prepare($db, $insertQuery);

            if ($stmt) {
                mysqli_stmt_bind_param($stmt, "sssss", $waitName, $waitProductId, $waitSub, $waitDesc, $waitImg);
                $run = mysqli_stmt_execute($stmt);
                mysqli_stmt_close($stmt);

                if ($run) {
                    // Create a new table using prepared statement
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

                    $stmt = mysqli_prepare($db, $createTableQuery);

                    if ($stmt) {
                        $run = mysqli_stmt_execute($stmt);
                        mysqli_stmt_close($stmt);

                        if ($run) {
                            $res = array(
                                "status" => 200,
                                "message" => "Waitlist created successfully"
                            );
                        } else {
                            $res = array(
                                "status" => 400,
                                "message" => "Error while creating table"
                            );
                        }
                    } else {
                        $res = array(
                            "status" => 500,
                            "message" => "Error preparing create table statement"
                        );
                    }
                } else {
                    $res = array(
                        "status" => 400,
                        "message" => "Error while inserting data into accordion table"
                    );
                }
            } else {
                $res = array(
                    "status" => 500,
                    "message" => "Error preparing insert statement"
                );
            }

            echo json_encode($res);
        } else {
            $res = array(
                "status" => 500,
                "message" => "Error preparing select statement"
            );
            echo json_encode($res);
        }
    } else if (isset($_POST['editName'])) {
        //updating the accordion content
        $ename = $_POST['editName'];
        $etype = $_POST['editType'];
        $esub = $_POST['editSub'];
        $edesc = $_POST['editCont'];
        $edimg = $_POST['editImg'];
        $tableid = $_POST['idx'];

        $query = "UPDATE accordion SET name = ?, type = ?, subhead = ?, content = ?, image = ? WHERE id = ?";
        $stmt = mysqli_prepare($db, $query);
        if ($stmt) {

            mysqli_stmt_bind_param($stmt, "sssssi", $ename, $etype, $esub, $edesc, $edimg, $tableid);
            $result = mysqli_stmt_execute($stmt);

            if ($result) {
                $res = array(
                    "status" => 200,
                    "message" => "Accordion updated successfully"
                );
            } else {
                $res = array(
                    "status" => 400,
                    "message" => "Error while updating accordion"
                );
            }
        } else {
            $res = array(
                "status" => 400,
                "message" => "Error while updating accordion"
            );
        }
        echo json_encode($res);
        return;
    } else if (isset($_POST['switchid'])) {
        //switching the status of the accordion content
        $id = $_POST['switchid'];
        $query = "UPDATE accordion SET status = (1 - status) WHERE id = '$id'";
        $result = mysqli_query($db, $query);
        if ($result) {
            $res = array(
                "status" => 200,
                "message" => "Switched status successfully"
            );
        } else {
            $res = array(
                "status" => 400,
                "message" => "Error while changing status"
            );
        }
        echo json_encode($res);
    }
}
