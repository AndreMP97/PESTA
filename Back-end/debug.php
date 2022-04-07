<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require __DIR__.'/classes/Database.php';
require __DIR__.'/classes/JwtHandler.php';

$allHeaders = getallheaders();
$db_connection = new Database();
$conn = $db_connection->dbConnection();

if(array_key_exists('Authorization',$allHeaders) && !empty(trim($allHeaders['Authorization']))):

    $id = trim($allHeaders['Authorization']);
    session_id($id);
    session_start();

    if(isset($_SESSION['token'])):

        $token = $_SESSION['token'];
        $jwt = new JwtHandler();
        $decoded = $jwt->_jwt_decode_data($token);
        $auth = $decoded['auth'];

        if ($auth == "1"):

            $data = (array)$decoded['data'];
            $usertype = $data['usertype'];

            if ($usertype == "diretor"):
                $id_curso = $data['id_curso'];
            endif;
            
            $returnData = [
                "success" => 1,
                "token" => $token,
                "decoded" => $decoded,
                "sessionID" => $id
            ];

        else:
            $returnData = [
                "success" => 1,
                "auth" => $auth,
                "message" => "Session Expired"
            ];
        
        endif;
    
    else:
        $returnData = [
            "success" => 0,
            "message" => "Unauthorized"
        ];
    
    endif;

else:
    $returnData = [
        "success" => 0,
        "message" => "Bad Headers"
    ];

endif;

echo json_encode($returnData);

?>