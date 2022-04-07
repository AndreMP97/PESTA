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

                $id_proposal = trim($request->id);

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

                        $archive = "UPDATE `propostas_dos_cursos` 
                        SET `data_fim`=now(), `arquivada`=1 
                        WHERE `id_proposta`=:id_proposal";
                        $update_stmt = $conn->prepare($archive);
                        $update_stmt->bindValue(':id_proposal', $id_proposal, PDO::PARAM_STR);
                        $update_stmt->execute();
                            
                        if($update_stmt->rowCount()):

                            $check_aluno = "SELECT candidatura.id, candidatura.numero_aluno, propostas_empresas.title
                            FROM `candidatura` 
                            JOIN `propostas_empresas` ON propostas_empresas.id_proposta = candidatura.id_proposta
                            WHERE candidatura.id_proposta=:id_proposal
                            AND `data_fim` IS NULL";
                            $check_aluno_stmt = $conn->prepare($check_aluno);
                            $check_aluno_stmt->bindValue(':id_proposal', $id_proposal, PDO::PARAM_STR);
                            $check_aluno_stmt->execute();

                            if($check_aluno_stmt->rowCount()):
                                while($row = $check_aluno_stmt->fetch(PDO::FETCH_ASSOC)) {
                                    $id_candidate = $row['id'];
                                    $num = $row['numero_aluno'];
                                    $email = $num . "@isep.ipp.pt";
                                    $title = $row['title'];

                                    $cancel = "UPDATE `candidatura` 
                                    SET `data_fim` = now() 
                                    WHERE `id`=:id_candidate";
                                    $update_stmt = $conn->prepare($cancel);
                                    $update_stmt->bindValue(':id_candidate', $id_candidate, PDO::PARAM_STR);
                                    $update_stmt->execute();

                                    $to = $email;
                                    //$to = "1181392@isep.ipp.pt";
                                    $subject = "Proposta cancelada!";
                                    $body = "A proposta '{$title}' foi cancelada! Por favor, candidate-se a uma nova proposta!";

                                    smtpmailer($to, $subject, $body);
                                }
    
                            endif;

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