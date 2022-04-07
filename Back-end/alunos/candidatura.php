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

            if ($usertype == "aluno"):

                $username = $data['username'];

                // CHECKING EMPTY FIELDS
                if(!isset($username) 
                    || empty(trim($username))
                    ):
    
                    $returnData = [
                        'success' => 0,
                        'errorMsg' => 'EMPTY'
                    ]; 
    
                // IF THERE ARE NO EMPTY FIELDS THEN-
                else:
    
                    $title = [];
                    $detail = [];
                    $company = [];
                    $street = [];
                    $email = [];
                    $website = [];
                    $supervisor = [];
                    $phone = [];
                    $course = [];
                    $message = [];
    
                    try {
                        $fetch_application = "SELECT candidatura.id_proposta 
                        FROM `candidatura`
                        WHERE `numero_aluno`= :username
                        AND data_fim IS NULL";
                        $search_stmt = $conn->prepare($fetch_application);
                        $search_stmt->bindValue(':username', $username, PDO::PARAM_STR);
                        $search_stmt->execute();
    
                        if($search_stmt->rowCount()):
                            while($row = $search_stmt->fetch(PDO::FETCH_ASSOC)) {
                                $id_proposta = $row['id_proposta'];
                            }

                            $fetch_application = "SELECT propostas_empresas.title, propostas_empresas.detail, propostas_empresas.company,
                            propostas_empresas.street, propostas_empresas.email, propostas_empresas.website, 
                            propostas_empresas.supervisor, propostas_empresas.phone, cursos.nome_curso, candidatura.mensagem
                            FROM `propostas_empresas`
                            JOIN `propostas_dos_cursos` ON propostas_dos_cursos.id_proposta = propostas_empresas.id_proposta
                            JOIN `candidatura` ON candidatura.id_proposta = propostas_empresas.id_proposta
                            JOIN `cursos` ON cursos.id_curso = propostas_dos_cursos.id_curso
                            WHERE propostas_empresas.id_proposta=:id_proposta";
                            $search_stmt = $conn->prepare($fetch_application);
                            $search_stmt->bindValue(':id_proposta', $id_proposta, PDO::PARAM_STR);
                            $search_stmt->execute();

                            if($search_stmt->rowCount()):
                                while($row = $search_stmt->fetch(PDO::FETCH_ASSOC)) {
                                    $title = $row['title'];
                                    $detail = $row['detail'];
                                    $company = $row['company'];
                                    $street = $row['street'];
                                    $email = $row['email'];
                                    $website = $row['website'];
                                    $supervisor = $row['supervisor'];
                                    $phone = $row['phone'];
                                    $course = $row['nome_curso'];
                                    if ($row['mensagem'] != null) {
                                        $message = $row['mensagem'];
                                    }
                                }

                                $returnData = [
                                    'success' => 1,
                                    'auth' => $auth,
                                    'isCandidate' => 1,
                                    'type' => "internship",
                                    'id' => $id_proposta,
                                    'title' => $title,
                                    'detail' => $detail,
                                    'company' => $company,
                                    'street' => $street,
                                    'email' => $email,
                                    'website' => $website,
                                    'supervisor' => $supervisor,
                                    'phone' => $phone,
                                    'course' => $course,
                                    'message' => $message
                                ];

                            else:

                                $fetch_application = "SELECT propostas.title, propostas.detail, cursos.nome_curso, candidatura.mensagem
                                FROM `propostas`
                                JOIN `propostas_docentes`ON propostas_docentes.id_proposta = propostas.id_proposta
                                JOIN `propostas_dos_cursos` ON propostas_dos_cursos.id_proposta = propostas.id_proposta
                                JOIN `atribuicoes` ON atribuicoes.id_proposta = propostas.id_proposta
                                JOIN `candidatura` ON candidatura.id_proposta = propostas.id_proposta
                                JOIN `cursos` ON cursos.id_curso = propostas_dos_cursos.id_curso
                                WHERE propostas.id_proposta = :id_proposta";
                                $search_stmt = $conn->prepare($fetch_application);
                                $search_stmt->bindValue(':id_proposta', $id_proposta, PDO::PARAM_STR);
                                $search_stmt->execute();

                                if($search_stmt->rowCount()):
                                    while($row = $search_stmt->fetch(PDO::FETCH_ASSOC)) {
                                        $title = $row['title'];
                                        $detail = $row['detail'];
                                        $course = $row['nome_curso'];
                                        if ($row['mensagem'] != null) {
                                            $message = $row['mensagem'];
                                        }
                                    }
                    
                                    $returnData = [
                                        'success' => 1,
                                        'auth' => $auth,
                                        'isCandidate' => 1,
                                        'type' => "project",
                                        'id' => $id_proposta,
                                        'title' => $title,
                                        'detail' => $detail,
                                        'course' => $course,
                                        'message' => $message
                                    ];  
                    
                                endif;
    
                            endif;

                        else:

                            $returnData = [
                                'success' => 1,
                                'auth' => $auth,
                                'message' => 'You have fetched data.',
                                'isCandidate' => 0
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
                    'message' => 'Unauthorized 1'
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
            'message' => 'Unauthorized 2'
        ];

    endif;

else:

    $returnData = [
        'success' => 0,
        'message' => 'Unauthorized 3'
    ];

endif;

echo json_encode($returnData, JSON_UNESCAPED_UNICODE);

?>