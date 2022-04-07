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
            $id_curso = $data['id_curso'];
            $usertype = $data['usertype'];

            if ($usertype == "diretor"):

                // CHECKING EMPTY FIELDS
                if(!isset($id_curso) 
                    || empty(trim($id_curso))
                    ):

                    $returnData = [
                        'success' => 0,
                        'errorMsg' => 'EMPTY'
                    ]; 

                // IF THERE ARE NO EMPTY FIELDS THEN-
                else:

                    $id_proposta = [];
                    $title = [];
                    $supervisor = [];
                    $date = [];
                    $student = [];

                    try {
                        $fetch_internships = "SELECT propostas.id_proposta, propostas.title, atribuicoes.orientador, atribuicoes.data_inicio, atribuicoes.numero_aluno
                        FROM `propostas`
                        JOIN `propostas_empresas` ON propostas_empresas.id_proposta = propostas.id_proposta
                        JOIN `propostas_dos_cursos` ON propostas_dos_cursos.id_proposta = propostas.id_proposta
                        JOIN `atribuicoes` ON atribuicoes.id_proposta = propostas.id_proposta 
                        WHERE `id_curso`= :id_curso 
                        AND `concluida` = '0' 
                        AND `arquivada` = '0'
                        AND `aprovada` = '1'
                        AND `numero_aluno` IS NOT NULL
                        ORDER BY atribuicoes.orientador, atribuicoes.data_inicio";
                        $search_stmt = $conn->prepare($fetch_internships);
                        $search_stmt->bindValue(':id_curso', $id_curso, PDO::PARAM_STR);
                        $search_stmt->execute();

                        if($search_stmt->rowCount()):
                            while($row = $search_stmt->fetch(PDO::FETCH_ASSOC)) {
                                $id_proposta[] = $row['id_proposta'];
                                $title[] = $row['title'];
                                $supervisor[] = $row['orientador'];
                                $date[] = date("d-m-Y", strtotime($row['data_inicio']));
                                $student[] = $row['numero_aluno'];
                            }
                        
                        endif;

                        $returnData = [
                            'success' => 1,
                            'auth' => $auth,
                            'message' => 'You have fetched data.',
                            'id_proposta' => $id_proposta,
                            'title' => $title,
                            'supervisor' => $supervisor,
                            'date' => $date,
                            'student' => $student
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