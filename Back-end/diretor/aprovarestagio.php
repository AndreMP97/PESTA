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

            if ($usertype == "diretor"):

                $id_proposal = trim($request->id);

                // CHECKING EMPTY FIELDS
                if(!isset($id_proposal)
                    || empty(trim($id_proposal))
                    ):

                    $returnData = [
                        'success' => 0,
                        'message' => 'EMPTY'
                    ]; 

                // IF THERE ARE NO EMPTY FIELDS THEN-
                else:

                    try {

                        $approve = "UPDATE propostas_empresas
                        SET aprovada = '1'
                        WHERE id_proposta = :id_proposal";
                        $update_stmt = $conn->prepare($approve);
                        $update_stmt->bindValue(':id_proposal', $id_proposal, PDO::PARAM_STR);
                        $update_stmt->execute();

                        if($update_stmt->rowCount()):

                            $insert_query = "INSERT INTO atribuicoes (id, id_proposta, orientador) 
                            VALUES(NULL,:id_proposal,'NA')";
                            $insert_stmt = $conn->prepare($insert_query);
                            $insert_stmt->bindValue(':id_proposal', $id_proposal, PDO::PARAM_STR);
                            $insert_stmt->execute();

                            if($insert_stmt->rowCount()):

                                $details = "SELECT title, email
                                FROM propostas_empresas
                                WHERE id_proposta = :id_proposal";
                                $search_stmt = $conn->prepare($details);
                                $search_stmt->bindValue(':id_proposal', $id_proposal, PDO::PARAM_STR);
                                $search_stmt->execute();

                                if($search_stmt->rowCount()):
                                    while($row = $search_stmt->fetch(PDO::FETCH_ASSOC)) {
                                        $email = $row['email'];
                                        $title = $row['title'];
                                    }

                                    $to = $email;
                                    //$to = "1181392@isep.ipp.pt"
                                    $subject = "Estágio aprovado!";
                                    $body = "O seu estágio '{$title}' foi aprovado pelo diretor de curso!";

                                    smtpmailer($to, $subject, $body);

                                endif;

                                $returnData = [
                                    'success' => 1,
                                    'auth' => $auth
                                ];

                            endif;
                            
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