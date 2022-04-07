<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
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
$returnData = [];

// IF REQUEST METHOD IS NOT EQUAL TO POST
if($_SERVER["REQUEST_METHOD"] != "GET"):
    $returnData = msg(0,404,'MUST BE A GET REQUEST');
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
                $id_proposal = $_GET["id"];
                $student = $_GET["student"];

                // CHECKING EMPTY FIELDS
                if(!isset($id_proposal) 
                    || !isset($student)
                    || empty(trim($id_proposal))
                    || empty(trim($student))
                    ):

                    $returnData = [
                        'success' => 0,
                        'errorMsg' => 'EMPTY'
                    ]; 

                // IF THERE ARE NO EMPTY FIELDS THEN-
                else:

                    $message = [];

                    try {
                        $fetch_internships = "SELECT `mensagem`
                        FROM `candidatura`
                        JOIN `propostas_empresas` ON propostas_empresas.id_proposta = candidatura.id_proposta
                        WHERE propostas_empresas.id_proposta=:id_proposal
                        AND `numero_aluno`=:student
                        AND `data_fim` IS NULL";
                        $search_stmt = $conn->prepare($fetch_internships);
                        $search_stmt->bindValue(':id_proposal', $id_proposal, PDO::PARAM_STR);
                        $search_stmt->bindValue(':student', $student, PDO::PARAM_STR);
                        $search_stmt->execute();

                        if($search_stmt->rowCount()):
                            while($row = $search_stmt->fetch(PDO::FETCH_ASSOC)) {
                                if ($row['mensagem'] != null) {
                                    $message = $row['mensagem'];
                                }
                            }
            
                            $returnData = [
                                'success' => 1,
                                'auth' => $auth,
                                'message' => $message
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