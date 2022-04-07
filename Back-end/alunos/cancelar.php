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

            if ($usertype == "aluno"):

                $id_proposal = trim($request->id);
                $username = $data['username'];

                // CHECKING EMPTY FIELDS
                if(!isset($id_proposal)
                    || empty(trim($id_proposal))
                    ):

                    $returnData = [
                        'success' => 0,
                        'errorMsg' => 'EMPTY'
                    ]; 

                // IF THERE ARE NO EMPTY FIELDS THEN-
                else:

                    try {

                        $check_aluno = "SELECT `id`
                        FROM `candidatura` 
                        WHERE `numero_aluno`=:username 
                        AND `id_proposta`=:id
                        AND `data_fim` IS NULL";
                        $check_aluno_stmt = $conn->prepare($check_aluno);
                        $check_aluno_stmt->bindValue(':id', $id_proposal, PDO::PARAM_STR);
                        $check_aluno_stmt->bindValue(':username', $username, PDO::PARAM_STR);
                        $check_aluno_stmt->execute();

                        if($check_aluno_stmt->rowCount()):
                            while($row = $check_aluno_stmt->fetch(PDO::FETCH_ASSOC)) {
                                $id_candidate = $row['id'];
                            }
                            
                            $cancel = "UPDATE `candidatura` 
                            SET `data_fim` = now() 
                            WHERE `id`=:id_candidate";
                            $update_stmt = $conn->prepare($cancel);
                            $update_stmt->bindValue(':id_candidate', $id_candidate, PDO::PARAM_STR);
                            $update_stmt->execute();
                                
                            $returnData = [
                                'success' => 1,
                                'auth' => $auth
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