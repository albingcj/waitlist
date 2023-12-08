<?php

if (($_SERVER['REQUEST_METHOD'] === 'POST') && isset($_POST['action'])) {
    if ($_POST['action'] === 'show') {
        $query = "SELECT * FROM users ORDER BY count DESC limit 100";
        $query_run = mysqli_query($db, $query);

        if (mysqli_num_rows($query_run) > 0) {
            $cnt = 1;
            while ($row = mysqli_fetch_assoc($query_run)) {
                echo '<tr>' . $cnt . '</tr>';
                echo '<tr>' . $row['name'] . '</tr>';
                echo '<tr>' . $row['count'] . '</tr>';
            }
        } else {
            echo 'No results';
        }
    }
}
