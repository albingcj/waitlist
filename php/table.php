<?php
include_once 'conn.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = $_GET['id'];
    $uid = 0;
    if (isset($_SESSION['userid'])) {
        $uid = $_SESSION['userid'];
    }

    $tableName = 'table' . $id;

    // Fetch top 5 records
    $query = "SELECT * FROM $tableName ORDER BY count DESC LIMIT 5";
    $query_run = mysqli_query($db, $query);

    // Fetch user count and position
    $query2 = "
    SELECT `count`,
    (SELECT COUNT(*) + 1 FROM $tableName AS t2 WHERE t2.`count` > t1.`count`) AS position
FROM $tableName AS t1
WHERE userid = $uid;
    ";

    $query_run2 = mysqli_query($db, $query2);
    $user = [];
    // var_dump($query2);
    if ($query_run2) {
        // Fetch the result as an associative array
        $result = mysqli_fetch_assoc($query_run2);

        if ($result) {
            $count = $result['count'];
            $position = $result['position'];
            $user = [
                'status' => 200,
                'count' => $count,
                'position' => $position,
            ];
        } else {
            // No results found
            $user = [
                'status' => 200,
                'count' => 0,
                'position' => "99+",
            ];
        }
    } else {
        // Query execution failed
        $user = [
            'status' => 400,
            'count' => 0,
            'position' => "99+",
            'message' => "Query execution failed: " . mysqli_error($db),
        ];
    }

    if ($query_run) {
        $data = array();

        while ($row = mysqli_fetch_assoc($query_run)) {
            $data[] = array(
                'name' => $row['name'],
                'count' => $row['count'],
                // 'image' => $row['image'],
            );
        }

        // Combine user details and top 5 records
        $resultArray = [
            'user' => $user,
            'topRecords' => $data,
        ];

        echo json_encode($resultArray);
    } else {
        // If the first query fails, only return user details
        echo json_encode(['user' => $user, 'topRecords' => []]);
    }
}
