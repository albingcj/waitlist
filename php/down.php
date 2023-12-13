<?php
include_once("conn.php");

// data for datatable2
// shows all the content of the clicked table
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = $_GET['id'];
    $table = 'table'.$id;
    $query = "SELECT * FROM $table";
    $result = mysqli_query($db, $query);
    $data = array();

    while ($r = mysqli_fetch_assoc($result)) {
        $rowData = array(
            'name' => $r['name'],
            'referal' => $r['count'],
            'status' => $r['flag']
        );
        $data[] = $rowData;
    }
    echo json_encode($data);
}