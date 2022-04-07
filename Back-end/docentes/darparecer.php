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

            if ($usertype == "docente"):

                // CHECKING EMPTY FIELDS
                if(!isset($request->id) 
                    || !isset($request->comments)
                    || empty(trim($request->id))
                    || empty(trim($request->comments))
                ):

                    $returnData = [
                        'success' => 0,
                        'message' => 'EMPTY'
                    ]; 

                // IF THERE ARE NO EMPTY FIELDS THEN-
                else:

                    $id_feedback = trim($request->id);
                    $comments = trim($request->comments);
                    $sigla = [];
                    $title = [];
                    $username = strtoupper($data['username']);

                    try {

                        $update_pareceres = "UPDATE `pareceres` 
                        SET `data_fim`=now(), `comentarios`=:comments, `parecer`='1' 
                        WHERE `id`=:id_feedback";
                        $update_stmt = $conn->prepare($update_pareceres);
                        $update_stmt->bindValue(':id_feedback', htmlspecialchars(strip_tags($id_feedback)),PDO::PARAM_STR);
                        $update_stmt->bindValue(':comments', htmlspecialchars(strip_tags($comments)),PDO::PARAM_STR);
                        $update_stmt->execute();

                        if($update_stmt->rowCount()):

                            $check_diretor = "SELECT diretores.sigla, propostas_empresas.title
                            FROM `diretores`
                            JOIN `propostas_dos_cursos` ON propostas_dos_cursos.id_curso = diretores.id_curso
                            JOIN `propostas_empresas` ON propostas_empresas.id_proposta = propostas_dos_cursos.id_proposta
                            JOIN `pareceres` ON pareceres.id_proposta = propostas_empresas.id_proposta
                            WHERE pareceres.id=:id_feedback";
                            $check_diretor_stmt = $conn->prepare($check_diretor);
                            $check_diretor_stmt->bindValue(':id_feedback', $id_feedback, PDO::PARAM_STR);
                            $check_diretor_stmt->execute();

                            if($check_diretor_stmt->rowCount()):
                                while($row = $check_diretor_stmt->fetch(PDO::FETCH_ASSOC)) {
                                    $sigla = strtolower($row['sigla']);
                                    $title = $row['title'];
                                    $email = $sigla . "@isep.ipp.pt";
                                }
                                
                                $to = $email;
                                //$to = "1181392@isep.ipp.pt";
                                $subject = "Pedido de parecer";
                                $body = "O docente {$username} deu o seu parecer ao estágio '{$title}'!";

                                smtpmailer($to, $subject, $body);

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