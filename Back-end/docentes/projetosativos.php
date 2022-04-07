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

                    $id_proposta = [];
                    $title = [];
                    $date = [];
                    $id_proposta_candidate = [];
                    $course = [];

                    try {
                        $fetch_projects = "SELECT propostas.id_proposta, propostas.title, propostas_dos_cursos.data_inicio, cursos.nome_curso
                        FROM `propostas`
                        JOIN `propostas_docentes` ON propostas_docentes.id_proposta = propostas.id_proposta
                        JOIN `propostas_dos_cursos` ON propostas_dos_cursos.id_proposta = propostas.id_proposta
                        JOIN `cursos` ON cursos.id_curso = propostas_dos_cursos.id_curso
                        JOIN `atribuicoes` ON atribuicoes.id_proposta = propostas.id_proposta 
                        LEFT JOIN `candidatosprojetos` ON candidatosprojetos.id_proposta = propostas.id_proposta
                        WHERE `sigla`= :username 
                        AND `concluida` = '0' 
                        AND `arquivada` = '0' 
                        AND atribuicoes.numero_aluno IS NULL
                        AND candidatosprojetos.id_proposta IS NULL
                        ORDER BY propostas_dos_cursos.data_inicio";
                        $search_stmt = $conn->prepare($fetch_projects);
                        $search_stmt->bindValue(':username', $username, PDO::PARAM_STR);
                        $search_stmt->execute();

                        if($search_stmt->rowCount()):
                            while($row = $search_stmt->fetch(PDO::FETCH_ASSOC)) {
                                $id_proposta[] = $row['id_proposta'];
                                $title[] = $row['title'];
                                $date[] = date("d-m-Y", strtotime($row['data_inicio']));
                                $course[] = $row['nome_curso'];
                            }
                        
                        endif;
            
                        $returnData = [
                            'success' => 1,
                            'auth' => $auth,
                            'message' => 'You have fetched data.',
                            'id_proposta' => $id_proposta,
                            'course' => $course,
                            'title' => $title,
                            'date' => $date
                        ];
                        
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
            'message' => 'Unauthorized2'
        ];

    endif;

else:

    $returnData = [
        'success' => 0,
        'message' => 'Unauthorized3'
    ];

endif;

echo json_encode($returnData, JSON_UNESCAPED_UNICODE);

?>