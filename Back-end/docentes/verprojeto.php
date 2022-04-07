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

            if ($usertype == "docente" || $usertype == "diretor"):
                $id_proposal = $_GET["id"];

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

                    $title = [];
                    $detail = [];
                    $requirements = [];
                    $course = [];
                    $assigned = [];
                    $concluded = [];

                    try {
                        $fetch_projects = "SELECT propostas.title, propostas.detail, propostas_docentes.recursos_dee, atribuicoes.numero_aluno, atribuicoes.concluida, cursos.nome_curso
                        FROM `propostas`
                        JOIN `propostas_docentes`ON propostas_docentes.id_proposta = propostas.id_proposta
                        JOIN `propostas_dos_cursos` ON propostas_dos_cursos.id_proposta = propostas.id_proposta
                        JOIN `atribuicoes` ON atribuicoes.id_proposta = propostas.id_proposta
                        JOIN `cursos` ON cursos.id_curso = propostas_dos_cursos.id_curso
                        WHERE propostas.id_proposta = :id_proposal";
                        $search_stmt = $conn->prepare($fetch_projects);
                        $search_stmt->bindValue(':id_proposal', $id_proposal, PDO::PARAM_STR);
                        $search_stmt->execute();

                        if($search_stmt->rowCount()):
                            while($row = $search_stmt->fetch(PDO::FETCH_ASSOC)) {
                                $title = $row['title'];
                                $detail = $row['detail'];
                                $requirements = $row['recursos_dee'];
                                $assigned = $row['numero_aluno'];
                                $concluded = $row['concluida'];
                                $course = $row['nome_curso'];
                            }
            
                            $returnData = [
                                'success' => 1,
                                'auth' => $auth,
                                'message' => 'You have fetched data.',
                                'id' => $id_proposal,
                                'title' => $title,
                                'detail' => $detail,
                                'requirements' => $requirements,
                                'assigned' => $assigned,
                                'concluded' => $concluded,
                                'course' => $course
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