<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
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

// IF REQUEST METHOD IS NOT EQUAL TO POST
if($_SERVER["REQUEST_METHOD"] != "POST"):
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
                $message = trim($request->message);
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
                        
                        $check_aluno = "SELECT `numero_aluno`
                        FROM `candidatura` 
                        WHERE `numero_aluno`=:username 
                        AND `data_fim` IS NULL";
                        $check_aluno_stmt = $conn->prepare($check_aluno);
                        $check_aluno_stmt->bindValue(':username', $username,PDO::PARAM_STR);
                        $check_aluno_stmt->execute();

                        if($check_aluno_stmt->rowCount()):
                            
                            $returnData = [
                                'success' => 0,
                                'isCandidate' => 1
                            ];

                        else:
                            
                            $candidatura = "INSERT INTO `candidatura`(`id`,`id_proposta`,`numero_aluno`,`mensagem`) VALUES(NULL,:id,:username,:message)";
                            $insert_stmt = $conn->prepare($candidatura);
                            $insert_stmt->bindValue(':id', $id_proposal, PDO::PARAM_STR);
                            $insert_stmt->bindValue(':username', $username, PDO::PARAM_STR);
                            $insert_stmt->bindValue(':message', htmlspecialchars(strip_tags($message)), PDO::PARAM_STR);
                            $insert_stmt->execute();

                            if($insert_stmt->rowCount()):

                                $details = "SELECT propostas.title, propostas_docentes.sigla
                                FROM propostas
                                JOIN propostas_docentes ON propostas_docentes.id_proposta = propostas.id_proposta
                                WHERE propostas.id_proposta = :id";

                                $search_stmt = $conn->prepare($details);
                                $search_stmt->bindValue(':id', $id_proposal, PDO::PARAM_STR);
                                $search_stmt->execute();

                                if($search_stmt->rowCount()):
                                    while($row = $search_stmt->fetch(PDO::FETCH_ASSOC)) {
                                        $sigla = $row['sigla'];
                                        $email = $sigla . "@isep.ipp.pt";
                                        $title = $row['title'];
                                    }

                                    $to = $email;
                                    //$to = "1181392@isep.ipp.pt";
                                    $subject = "Novo candidato a '{$title}'!";
                                    $body = "O aluno {$username} candidatou-se à sua proposta '{$title}'!";

                                    smtpmailer($to, $subject, $body);

                                else:

                                    $details = "SELECT propostas.title, propostas_empresas.email
                                    FROM propostas
                                    JOIN propostas_empresas ON propostas_empresas.id_proposta = propostas.id_proposta
                                    WHERE propostas.id_proposta = :id";

                                    $search_stmt = $conn->prepare($details);
                                    $search_stmt->bindValue(':id', $id_proposal, PDO::PARAM_STR);
                                    $search_stmt->execute();

                                    if($search_stmt->rowCount()):
                                        while($row = $search_stmt->fetch(PDO::FETCH_ASSOC)) {
                                            $email = $row['email'];
                                            $title = $row['title'];
                                        }

                                        $to = $email;
                                        //$to = "1181392@isep.ipp.pt";
                                        $subject = "Novo candidato a '{$title}'!";
                                        $body = "O aluno {$username} candidatou-se à sua proposta '{$title}'!";

                                        smtpmailer($to, $subject, $body);

                                    endif;

                                endif;

                                $returnData = [
                                    'success' => 1,
                                    "auth" => $auth,
                                    'successMsg' => 'Candidatura efetuada com sucesso!'
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