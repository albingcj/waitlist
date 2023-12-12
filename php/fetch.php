<?php
include_once 'conn.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SESSION['userid'])) {
        $uid = $_SESSION['userid'];

        //joined user waitists
        $query1 = "
        SELECT * from accordion
        WHERE FIND_IN_SET(id, (SELECT joinedTables FROM userlist WHERE id = $uid)) > 0;
        ";
        $query_run1 = mysqli_query($db, $query1);


        //waitlists that user has not yet joined
        $query2 = "
        SELECT *
        FROM accordion
        WHERE FIND_IN_SET(id, (SELECT joinedTables FROM userlist WHERE id = $uid)) = 0;
        ";
        $query_run2 = mysqli_query($db, $query2);


        $query3 = "SELECT * FROM userlist WHERE id = $uid AND joinedTables IS NULL;";
        $query_run3 = mysqli_query($db, $query3);
        if (mysqli_num_rows($query_run3) > 0) {
            $query2 = "SELECT * FROM accordion WHERE id = $uid";
            $query_run2 = mysqli_query($db, $query2);
        }


        // $query3 = "SELECT TRIM(TRAILING ',' FROM joinedTables) FROM userlist WHERE id = $uid";
        // var_dump(mysqli_query($db, $query3));

        $data = array();

        if ($query_run1) {
            while ($row = mysqli_fetch_assoc($query_run1)) {
                $data[] = array(
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'subhead' => $row['subhead'],
                    'type' => $row['type'],
                    'content' => $row['content'],
                    'image' => $row['image'],
                    'status' => $row['status']
                );
            }
        } else {
            $data[] = array(
                'id' => '',
                'name' => '',
                'subhead' => '',
                'type' => '',
                'content' => '',
                'image' => '',
                'status' => ''
            );
        }

        // Include results from the second query in the same response
        if ($query_run2 || $query_run3) {
            $data2 = array();

            while ($row = mysqli_fetch_assoc($query_run2)) {
                $data2[] = array(
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'subhead' => $row['subhead'],
                    'type' => $row['type'],
                    'content' => $row['content'],
                    'image' => $row['image'],
                    'status' => $row['status']
                );
            }

            echo json_encode(['data1' => $data, 'data2' => $data2]);
        } else {
            echo json_encode(['data1' => $data, 'data2' => []]);
        }
    } else {
        $query = "SELECT * FROM accordion ";
        $query_run = mysqli_query($db, $query);
        $data = array();
        while ($row = mysqli_fetch_assoc($query_run)) {
            $data[] = array(
                'id' => $row['id'],
                'name' => $row['name'],
                'subhead' => $row['subhead'],
                'type' => $row['type'],
                'content' => $row['content'],
                // 'image' => 'https://www.placeholder.com/400',
                'image' => $row['image'],
                'status' => $row['status']
            );
        }
        echo json_encode(['data2' => $data, 'data1' => []]);
    }
}
