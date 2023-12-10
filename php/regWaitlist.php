<?php
include_once('conn.php');
session_start();

// store the register details in the corresponding table
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['waitname'];
    $type = $_POST['waitType'];
    $refer = $_POST['referal'];
    $userid = $_POST['userid'];
    $tableid = 'table' . $_POST['tableid'];
    // Insert data into the table using a prepared statement
    $query = "INSERT INTO $tableid (name, userid) VALUES (?, ?)";
    $stmt = $db->prepare($query);

    // Check if the statement was prepared successfully
    if ($stmt) {
        // Bind parameters
        $stmt->bind_param('si', $name, $userid);
        // Execute the statement
        $stmt->execute();
        // Check if the data was inserted successfully
        if ($stmt->affected_rows > 0) {
            // Check if $refer is not null before incrementing count
            if ($refer !== null) {
                // Increment count for every person with the same user ID in the same table
                $addQuery = "UPDATE $tableid SET count = count + 1 WHERE userid = ?";
                $addStmt = $db->prepare($addQuery);
                $addStmt->bind_param('i', $refer);
                $addStmt->execute();
                $addStmt->close();
            }

            $res = [
                'status' => 200,
                'message' => "Data inserted successfully"
            ];
        } else {
            // Data not inserted
            $res = [
                'status' => 400,
                'message' => "Data not inserted"
            ];
        }
        // Close the statement
        $stmt->close();
    } else {
        // Statement not prepared successfully
        $res = [
            'status' => 400,
            'message' => "Error preparing statement"
        ];
    }

    echo json_encode($res);
}
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $waittype = $_GET['waitType'];
    $query = "SELECT id FROM accordion WHERE type = '$waittype'";
    
    $result = $db->query($query);
    
    if ($result) {
        if ($result->num_rows > 0) {
            $tableid = $result->fetch_assoc()['id'];
            
            $res = [
                'status' => 200,
                'message' => "Table id found",
                'tableid' => $tableid
            ];
        } else {
            // No rows found
            $res = [
                'status' => 400,
                'message' => "Table id not found"
            ];
            
        }
    } else {
        // Query execution error
        $res = [
            'status' => 500,
            'message' => "Error executing query: " . $db->error
        ];
    }
    
    echo json_encode($res);
}
?>