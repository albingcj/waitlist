<?php
include_once 'conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT * FROM accordion";
    $query_run = mysqli_query($db, $query);

    if ($query_run) {
        $data = array();

        while ($row = mysqli_fetch_assoc($query_run)) {
            $data[] = array(
                'id' => $row['id'],
                'name' => $row['name'],
                'subhead' => $row['subhead'],
                'type' => $row['type'],
                'content' => $row['content'],
                'tableid' => $row['tableid'],
                'image' => 'https://www.placeholder.com/400',
                // 'image' => $row['image'],
            );
        }
    } else {
        $data[] = array(
            'id' => '',
            'name' => '',
            'subhead' => '',
            'type' => '',
            'content' => '',
            'tableid' => '',
            'image' => '',
        );
    }

    echo json_encode($data);
}
?>
