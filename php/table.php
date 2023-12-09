<?php
include_once 'conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = $_GET['id'];
    $tableName = 'table' . $id;
    $query = "SELECT * FROM $tableName WHERE flag = 0 ORDER BY count DESC LIMIT 5";
    $query_run = mysqli_query($db, $query);

    if ($query_run) {
        $data = array();

        while ($row = mysqli_fetch_assoc($query_run)) {
            $data[] = array(
                'name' => $row['name'],
                'count' => $row['count'],
                // 'image' => $row['image'],
            );
        }
    } else {
        $data[] = array(
            'name' => '',
            'count' => '',
        );
    }

    echo json_encode($data);
}