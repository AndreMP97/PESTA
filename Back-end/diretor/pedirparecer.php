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

// IF REQUEST METHOD IS NOT EQUAL TO PUT
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

            if ($usertype == "diretor"):

                $id_proposal = trim($request->id);
                $sigla = trim($request->sigla);
                $title = trim($request->title);

                // CHECKING EMPTY FIELDS
                if(!isset($id_proposal)
                    || !isset($sigla)
                    || !isset($title)
                    || empty(trim($id_proposal))
                    || empty(trim($sigla))
                    || empty(trim($title))
                    ):

                    $returnData = [
                        'success' => 0,
                        'message' => 'EMPTY'
                    ]; 

                // IF THERE ARE NO EMPTY FIELDS THEN-
                else:

                    $parecer = "0";

                    try {

                        $insert_query = "INSERT INTO pareceres (id, id_proposta, sigla, data_inicio, data_fim, comentarios, parecer) 
                        VALUES(NULL,:id_proposal,:sigla,now(),NULL,NULL,:parecer)";
                        $insert_stmt = $conn->prepare($insert_query);
                        $insert_stmt->bindValue(':id_proposal', htmlspecialchars(strip_tags($id_proposal)), PDO::PARAM_STR);
                        $insert_stmt->bindValue(':sigla', htmlspecialchars(strip_tags($sigla)), PDO::PARAM_STR);
                        $insert_stmt->bindValue(':parecer', htmlspecialchars(strip_tags($parecer)), PDO::PARAM_STR);
                        $insert_stmt->execute();

                        if($insert_stmt->rowCount()):

                            $update_internships = "UPDATE propostas_empresas
                            SET aprovada = '3'
                            WHERE id_proposta = :id_proposal";
                            $update_stmt = $conn->prepare($update_internships);
                            $update_stmt->bindValue(':id_proposal', $id_proposal, PDO::PARAM_STR);
                            $update_stmt->execute();

                            if($update_stmt->rowCount()):

                                $email = strtolower($sigla) . "@isep.ipp.pt";
                                $to = $email;
                                //$to = "1181392@isep.ipp.pt"
                                $subject = "Pedido de parecer!";
                                $body = "Foi-lhe pedido para dar o seu parecer ao estágio '{$title}'! Consulte o Portal para mais informações!";

                                smtpmailer($to, $subject, $body);

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