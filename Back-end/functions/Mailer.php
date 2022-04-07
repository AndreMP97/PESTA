<?php 

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require __DIR__.'/../PHPMailer/src/Exception.php';
require __DIR__.'/../PHPMailer/src/PHPMailer.php';
require __DIR__.'/../PHPMailer/src/SMTP.php';
include_once __DIR__.'/../config.php';

$returnData = [];

function smtpmailer($to, $subject, $body) {

    $mail = new PHPMailer(true);
    $name = 'Portal PESTA';

    try {
        //Server settings
        $mail->SMTPDebug = 0;                                       //Enable verbose debug output
        $mail->isSMTP();                                            //Send using SMTP
        $mail->Host       = smtp_host;                              //Set the SMTP server to send through
        $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
        $mail->Username   = smtp_username;                          //SMTP username
        $mail->Password   = smtp_password;                          //SMTP password
        $mail->SMTPSecure = 'tls';                                  //Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
        $mail->Port       = 587;                                    //TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above
        $mail->CharSet = 'UTF-8';

        //Recipients
        $mail->setFrom(smtp_username, $name);
        $mail->addAddress($to);     //Add a recipient

        //Content
        $mail->isHTML(false);                                  //Set email format to HTML
        $mail->Subject = $subject;
        $mail->Body = $body;

        $mail->send();

        $returnData = [
            'success' => 1,
            'message' => 'Message has been sent'
        ];
    } 
    
    catch (Exception $e) {
        $returnData = [
            'success' => 0,
            'message' => 'Message could not be sent. Mailer Error:' {$mail->ErrorInfo}
        ];
    }

}

//echo json_encode($returnData, JSON_UNESCAPED_UNICODE);

?>