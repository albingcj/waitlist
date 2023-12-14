<?php
include_once("conn.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['count']) && isset($_POST['id'])) {
        $count = $_POST['count'];
        $tid = $_POST['id'];
        $table = 'table' . $tid;

        for ($i = 0; $i < $count; $i++) {
            // Check if the table is empty or all flagged records have been processed
            $query = "SELECT * FROM $table WHERE flag = 0";
            $result = mysqli_query($db, $query);

            if (mysqli_num_rows($result) <= 0) {
                $res = [
                    'status' => 201,
                    'message' => "All send and Waitlist cleared!",
                ];
                echo json_encode($res);
                return;
            }


            //get product name
            $query = "SELECT name FROM accordion WHERE id = $tid";
            $result = mysqli_query($db, $query);
            $result = mysqli_fetch_assoc($result);
            $pname = $result['name'];



            // Update the current maximum count field value, set flag to 1, and get user information
            $query = "
                SELECT users.email, users.id, users.name
                FROM users
                JOIN $table AS t ON users.id = t.userid
                WHERE t.flag = 0
                ORDER BY t.count DESC
                LIMIT 1;
            ";

            $popuser = mysqli_query($db, $query);
            $popuser = mysqli_fetch_assoc($popuser);

            $popid = $popuser['id'];
            $popname = $popuser['name'];
            $popmail = $popuser['email'];

            $to = $popmail;
            $subject = 'Your ' . $pname . ' is here!';
            $message = '
            <!DOCTYPE html>
            <html lang="en">

            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Congratulations!</title>
            <style>
                body {
                font-family: "Arial", sans-serif;
                background-color: #f8f8f8;
                margin: 0;
                padding: 0;
                }

                .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h1 {
                color: #007bff;
                }

                p {
                color: #333;
                }

                img {
                max-width: 100%;
                height: auto;
                display: block;
                margin: 20px 0;
                }

                .footer {
                margin-top: 20px;
                text-align: center;
                color: #777;
                }
            </style>
            </head>

            <body>
            <div class="container">
                <h1>Congratulations ' . $popname . '!</h1>
                <p>You reached the top of our ' . $pname . ' waitlist. 🎉</p>
                <img src="https://i.pinimg.com/originals/76/6a/65/766a657f2bbc5a38bb544880417a9aca.gif" alt="Happy Congrats GIF">
                <p>Thank you for your patience. We are excited to share you the product link!</p>
                <a href="https://www.google.com">Click here to get the product</a>
                <p>Best regards,<br> The '.$pname.' developers</p>
            </div>
            </body>

            </html>';


            $mail = new PHPMailer(true);




            try {
                // Server settings
                $mail->SMTPDebug = 2;   // Enable verbose debug output
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Username = 'dummygcj@gmail.com';  // Your Gmail address
                $mail->Password = 'cnnj ceth jwfq ixfg';   // Your Generated App password
                $mail->SMTPSecure = 'tls';
                $mail->Port = 587;

                // Recipients
                $mail->setFrom('albingcj@gmail.com', 'Admin Waitlist');
                $mail->addAddress($to);

                // Content
                $mail->isHTML(true);
                $mail->Subject = $subject;
                $mail->Body = $message;

                // Send the email
                if ($mail->send()) {
                    $query = "UPDATE $table SET flag = 1 WHERE userid = $popid";
                    mysqli_query($db, $query);

                    // reduce the number from queue in accordion table. if the number when minused from the current queue is less than zero, set it to zero
                    $query = "UPDATE accordion SET queue = GREATEST(0, queue - 1) WHERE id = $tid";
                    mysqli_query($db, $query);
                } else {
                    $res = [
                        'status' => 400,
                        'message' => "Mail not sent!",
                    ];
                    echo json_encode($res);
                    return;
                }
            } catch (Exception $e) {
                $res = [
                    'status' => 400,
                    'message' => "Mail not sent!" + $e,
                ];
                echo json_encode($res);
                return;
            }
        }

        $res = [
            'status' => 200,
            'message' => "Mails sent!",
        ];
        echo json_encode($res);
    }
}
