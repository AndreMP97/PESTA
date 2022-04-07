<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require __DIR__.'/classes/Database.php';

$allHeaders = getallheaders();
$db_connection = new Database();
$conn = $db_connection->dbConnection();
$returnData = [];

if($_SERVER["REQUEST_METHOD"] != ("POST")):
    $returnData = msg(0,404,'Page Not Found!');

else:
    if(array_key_exists('Authorization',$allHeaders) && !empty(trim($allHeaders['Authorization']))):

        $id = trim($allHeaders['Authorization']);
        session_id($id);
        session_start(); 
        session_destroy();

        $returnData = [
            "success" => 1,
            "message" => "Logged out"
        ];
    
    else:
        $returnData = [
            "success" => 0,
            "message" => "Error"
        ];
    endif;
    
endif;

echo json_encode($returnData);

?>