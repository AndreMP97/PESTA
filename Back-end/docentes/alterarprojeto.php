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
    $returnData = msg(0,404,'MUST BE A PUT REQUEST');
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

            if ($usertype == "docente" || $usertype == "diretor"):

                // CHECKING EMPTY FIELDS
                if(!isset($request->id) 
                    || !isset($request->title) 
                    || !isset($request->detail)
                    || !isset($request->requirements)
                    || empty(trim($request->id))
                    || empty(trim($request->title))
                    || empty(trim($request->detail))
                    || empty(trim($request->requirements))
                ):

                    $returnData = [
                        'success' => 0,
                        'message' => 'EMPTY'
                    ]; 

                // IF THERE ARE NO EMPTY FIELDS THEN-
                else:

                    $id_proposal = trim($request->id);
                    $title = trim($request->title);
                    $detail = trim($request->detail);
                    $requirements = trim($request->requirements);

                    try {

                        $update_propostas = "UPDATE propostas, propostas_docentes 
                        SET propostas.title=:title, propostas.detail=:detail, propostas_docentes.recursos_dee=:requirements 
                        WHERE propostas.id_proposta=:id_proposal
                        AND propostas_docentes.id_proposta=:id_proposal";
                        $update_stmt = $conn->prepare($update_propostas);
                        $update_stmt->bindValue(':id_proposal', htmlspecialchars(strip_tags($id_proposal)),PDO::PARAM_STR);
                        $update_stmt->bindValue(':title', htmlspecialchars(strip_tags($title)),PDO::PARAM_STR);
                        $update_stmt->bindValue(':detail', htmlspecialchars(strip_tags($detail)),PDO::PARAM_STR);
                        $update_stmt->bindValue(':requirements', htmlspecialchars(strip_tags($requirements)),PDO::PARAM_STR);
                        $update_stmt->execute();

                        if($update_stmt->rowCount()):
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
                    'message' => 'Unauthorized (1)'
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
            'message' => 'Unauthorized (2)'
        ];

    endif;

else:

    $returnData = [
        'success' => 0,
        'message' => 'Unauthorized (3)'
    ];

endif;

echo json_encode($returnData, JSON_UNESCAPED_UNICODE);

?>