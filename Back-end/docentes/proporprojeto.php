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

            if ($usertype == "docente" || $usertype == "diretor"):

                $username = $data['username'];

                // CHECKING EMPTY FIELDS
                if(!isset($username) 
                    || !isset($request->title)
                    || !isset($request->detail) 
                    || !isset($request->requirements)
                    || !isset($request->course)
                    || empty(trim($username))
                    || empty(trim($request->title))
                    || empty(trim($request->detail))
                    || empty(trim($request->requirements))
                    || empty(trim($request->course))
                ):
    
                    $returnData = [
                        'success' => 0,
                        'errorMsg' => 'EMPTY'
                    ]; 

                // IF THERE ARE NO EMPTY FIELDS THEN-
                else:

                    $title = trim($request->title);
                    $detail = trim($request->detail);
                    $requirements = trim($request->requirements);
                    $course = trim($request->course);

                    try {

                        //procurar ID do curso
                        $fetch_course = "SELECT cursos.id_curso
                        FROM `cursos` 
                        WHERE `nome_curso`=:course";
                        $search_stmt = $conn->prepare($fetch_course);
                        $search_stmt->bindValue(':course', $course, PDO::PARAM_STR);
                        $search_stmt->execute();

                        if($search_stmt->rowCount()):
                            while($row = $search_stmt->fetch(PDO::FETCH_ASSOC)) {
                                $id_curso = $row['id_curso'];
                            }

                            //inserir na tabela propostas
                            $insert_query = "INSERT INTO propostas (id_proposta, title, detail) 
                            VALUES(NULL,:title,:detail)";
                            $insert_stmt = $conn->prepare($insert_query);
                            $insert_stmt->bindValue(':title', htmlspecialchars(strip_tags($title)),PDO::PARAM_STR);
                            $insert_stmt->bindValue(':detail', htmlspecialchars(strip_tags($detail)),PDO::PARAM_STR);
                            $insert_stmt->execute();

                            //id da proposta
                            $last_id = $conn->lastInsertId();
                            
                            if($insert_stmt->rowCount()):

                                //inserir na tabela propostas_docentes
                                $insert_query = "INSERT INTO propostas_docentes (id_proposta, sigla, recursos_dee) 
                                VALUES(:id_proposal,:username,:requeriments)";
                                $insert_stmt = $conn->prepare($insert_query);
                                $insert_stmt->bindValue(':id_proposal', htmlspecialchars(strip_tags($last_id)),PDO::PARAM_STR);
                                $insert_stmt->bindValue(':username', htmlspecialchars(strip_tags($username)),PDO::PARAM_STR);
                                $insert_stmt->bindValue(':requeriments', htmlspecialchars(strip_tags($requirements)),PDO::PARAM_STR);
                                $insert_stmt->execute();

                                if($insert_stmt->rowCount()): 

                                    //inserir na tabela propostas_cursos
                                    $insert_query = "INSERT INTO propostas_dos_cursos (id, id_proposta, id_curso) 
                                    VALUES(NULL,:id_proposal,:id_curso)";
                                    $insert_stmt = $conn->prepare($insert_query);
                                    $insert_stmt->bindValue(':id_proposal', htmlspecialchars(strip_tags($last_id)),PDO::PARAM_STR);
                                    $insert_stmt->bindValue(':id_curso', htmlspecialchars(strip_tags($id_curso)),PDO::PARAM_STR);
                                    $insert_stmt->execute();

                                    if($insert_stmt->rowCount()): 
                                        
                                        $insert_query = "INSERT INTO atribuicoes (id, id_proposta, orientador) 
                                        VALUES(NULL,:id_proposal,:username)";
                                        $insert_stmt = $conn->prepare($insert_query);
                                        $insert_stmt->bindValue(':id_proposal', htmlspecialchars(strip_tags($last_id)),PDO::PARAM_STR);
                                        $insert_stmt->bindValue(':username', htmlspecialchars(strip_tags($username)),PDO::PARAM_STR);
                                        $insert_stmt->execute();

                                        if($insert_stmt->rowCount()):

                                            $returnData = [
                                                'success' => 1,
                                                'auth' => $auth,
                                                'message' => 'Proposta submetida!'
                                            ];

                                        endif;

                                    endif;

                                endif;

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