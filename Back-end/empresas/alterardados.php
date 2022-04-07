<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: PUT");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

function msg($success,$status,$message,$extra = []){
    return array_merge([
        'success' => $success,
        'status' => $status,
        'message' => $message
    ],$extra);
}

// INCLUDING DATABASE AND MAKING OBJECT
require __DIR__.'/../classes/Database.php';
require __DIR__.'/../classes/JwtHandler.php';
require __DIR__.'/../functions/Mailer.php';
$db_connection = new Database();
$conn = $db_connection->dbConnection();
$allHeaders = getallheaders();
$request = json_decode(file_get_contents("php://input"));
$returnData = [];

// IF REQUEST METHOD IS NOT EQUAL TO PUT
if($_SERVER["REQUEST_METHOD"] != "PUT"):
    $returnData = msg(0,404,'MUST BE A POST REQUEST');
endif;

if(array_key_exists("Authorization", $allHeaders)):
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

            if ($usertype == "empresa"):

                $id_company = $data['id_company'];

                $street = trim($request->street);
                $website = trim($request->website);
                $supervisor = trim($request->supervisor);
                $phone = trim($request->phone);

                // CHECKING EMPTY FIELDS
                if(!isset($id_company) 
                    || !isset($street) 
                    || !isset($website) 
                    || !isset($supervisor) 
                    || !isset($phone) 
                    || empty(trim($id_company))
                    || empty(trim($street))
                    || empty(trim($website))
                    || empty(trim($supervisor))
                    || empty(trim($phone))
                    ):
    
                    $returnData = [
                        'success' => 0,
                        'errorMsg' => 'EMPTY'
                    ]; 

                // IF THERE ARE NO EMPTY FIELDS THEN-
                else:

                    try {

                        $archive = "UPDATE `empresas` 
                        SET `street`=:street, `website`=:website, `representante`=:supervisor, `phone`=:phone 
                        WHERE `id_company`=:id_company";
                        $update_stmt = $conn->prepare($archive);
                        $update_stmt->bindValue(':id_company', $id_company, PDO::PARAM_STR);
                        $update_stmt->bindValue(':street', htmlspecialchars(strip_tags($street)), PDO::PARAM_STR);    
                        $update_stmt->bindValue(':website', htmlspecialchars(strip_tags($website)), PDO::PARAM_STR);
                        $update_stmt->bindValue(':supervisor', htmlspecialchars(strip_tags($supervisor)), PDO::PARAM_STR);
                        $update_stmt->bindValue(':phone', htmlspecialchars(strip_tags($phone)), PDO::PARAM_STR);
                        $update_stmt->execute();
                            
                        if($update_stmt->rowCount()):
                                    
                            $returnData = [
                                'success' => 1,
                                'auth' => $auth,
                                'message' => "Dados alterados com sucesso!"
                            ];

                        endif;
 
                    }  

                    catch(PDOException $e){
                        $returnData = msg(0,500,$e->getMessage());
                    }

                endif;
            
            else:

                $returnData = [
                    'success' => 0,
                    'message' => 'Unauthorized'
                ];
        
            endif;

        else:

            $returnData = [
                "success" => 1,
                "auth" => $auth,
                "message" => "Session Expired"
            ];
        
        endif;

    else:

        $returnData = [
            'success' => 0,
            'message' => 'Unauthorized'
        ];

    endif;

else:

    $returnData = [
        'success' => 0,
        'message' => 'Unauthorized'
    ];

endif;

echo json_encode($returnData, JSON_UNESCAPED_UNICODE);

?>