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

                $id_proposal = trim($request->id);
                $student = trim($request->student);
                $title = trim($request->title);

                // CHECKING EMPTY FIELDS
                if(!isset($id_proposal)
                    || !isset($student)
                    || !isset($title)
                    || empty(trim($id_proposal))
                    || empty(trim($student))
                    || empty(trim($title))
                    ):

                    $returnData = [
                        'success' => 0,
                        'message' => 'EMPTY'
                    ]; 

                // IF THERE ARE NO EMPTY FIELDS THEN-
                else:

                    try {

                        $check_aluno = "SELECT 
                        `numero_aluno` 
                        FROM `atribuicoes` 
                        WHERE `numero_aluno`=:student 
                        AND `data_fim` IS NULL
                        AND `concluida`='0'";
                        $check_aluno_stmt = $conn->prepare($check_aluno);
                        $check_aluno_stmt->bindValue(':student', $student, PDO::PARAM_STR);
                        $check_aluno_stmt->execute();

                        if($check_aluno_stmt->rowCount()):
                            $returnData = [
                                'success' => 0,
                                'auth' => $auth,
                                'message' => 'Este aluno já se encontra atribuido a outra proposta!'
                            ];

                        else:

                            $assign = "UPDATE `atribuicoes`, `propostas_dos_cursos`
                            SET atribuicoes.numero_aluno=:student, 
                            atribuicoes.data_inicio=now(),
                            propostas_dos_cursos.data_fim=now()
                            WHERE atribuicoes.id_proposta=:id_proposal
                            AND propostas_dos_cursos.id_proposta=:id_proposal";
                            $update_stmt = $conn->prepare($assign);
                            $update_stmt->bindValue(':id_proposal', $id_proposal, PDO::PARAM_STR);
                            $update_stmt->bindValue(':student', $student, PDO::PARAM_STR);
                            $update_stmt->execute();

                            if($update_stmt->rowCount()):

                                $check_aluno = "SELECT candidatura.id, candidatura.numero_aluno
                                FROM `propostas`
                                JOIN `candidatura` ON candidatura.id_proposta = propostas.id_proposta
                                JOIN `propostas_docentes` ON propostas_docentes.id_proposta = propostas.id_proposta
                                WHERE candidatura.id_proposta=:id_proposal
                                AND candidatura.data_fim IS NULL";
                                $check_aluno_stmt = $conn->prepare($check_aluno);
                                $check_aluno_stmt->bindValue(':id_proposal', $id_proposal, PDO::PARAM_STR);
                                $check_aluno_stmt->execute();
    
                                if($check_aluno_stmt->rowCount()):
                                    while($row = $check_aluno_stmt->fetch(PDO::FETCH_ASSOC)) {
                                        $id_candidate = $row['id'];
                                        $num = $row['numero_aluno'];
                                        $email = $num . "@isep.ipp.pt";

                                        if ($num == $student): 
                                            $cancel = "UPDATE `candidatura` 
                                            SET `data_fim` = now() 
                                            WHERE `id`=:id_candidate";
                                            $update_stmt = $conn->prepare($cancel);
                                            $update_stmt->bindValue(':id_candidate', $id_candidate, PDO::PARAM_STR);
                                            $update_stmt->execute();

                                            $to = $email;
                                            //$to = "1181392@isep.ipp.pt";
                                            $subject = "Proposta atribuída!";
                                            $body = "A proposta '{$title}' foi-lhe atribuída!";

                                            smtpmailer($to, $subject, $body);

                                        else:
                                            $cancel = "UPDATE `candidatura` 
                                            SET `data_fim` = now() 
                                            WHERE `id`=:id_candidate";
                                            $update_stmt = $conn->prepare($cancel);
                                            $update_stmt->bindValue(':id_candidate', $id_candidate, PDO::PARAM_STR);
                                            $update_stmt->execute();
        
                                            $to = $email;
                                            //$to = "1181392@isep.ipp.pt";
                                            $subject = "Proposta não atribuída!";
                                            $body = "A proposta '{$title}' não lhe foi atribuída! Pode candidatar-se a uma nova proposta!";
        
                                            smtpmailer($to, $subject, $body);

                                        endif;
                                    }
        
                                else:

                                    $email = $student . "@isep.ipp.pt";
                                    $to = $email;
                                    //$to = "1181392@isep.ipp.pt";
                                    $subject = "Proposta atribuída!";
                                    $body = "A proposta '{$title}' foi-lhe atribuída!";

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