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

            if ($usertype == "empresa"):

                $id_company = $data['id_company'];

                // CHECKING EMPTY FIELDS
                if(!isset($id_company)
                    || !isset($request->title) 
                    || !isset($request->detail) 
                    || !isset($request->company)
                    || !isset($request->street)
                    || !isset($request->email)
                    || !isset($request->website)
                    || !isset($request->supervisor)
                    || !isset($request->phone)
                    || !isset($request->course)
                    || empty(trim($id_company))
                    || empty(trim($request->title))
                    || empty(trim($request->detail))
                    || empty(trim($request->company))
                    || empty(trim($request->street))
                    || empty(trim($request->email))
                    || empty(trim($request->website))
                    || empty(trim($request->supervisor))
                    || empty(trim($request->phone))
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
                    $company = trim($request->company);
                    $street = trim($request->street);
                    $email = trim($request->email);
                    $website = trim($request->website);
                    $supervisor = trim($request->supervisor);
                    $phone = trim($request->phone);
                    $course = trim($request->course);
                    $aprovada = "0";

                    try {

                        //procurar ID do curso
                        $fetch_course = "SELECT cursos.id_curso, cursos.sigla_diretor_curso
                        FROM `cursos` 
                        WHERE `nome_curso`=:course";
                        $search_stmt = $conn->prepare($fetch_course);
                        $search_stmt->bindValue(':course', $course, PDO::PARAM_STR);
                        $search_stmt->execute();

                        if($search_stmt->rowCount()):
                            while($row = $search_stmt->fetch(PDO::FETCH_ASSOC)) {
                                $id_curso = $row['id_curso'];
                                $sigla = $row['sigla_diretor_curso'];
                            }

                            //inserir na tabela propostas
                            $insert_query = "INSERT INTO propostas (id_proposta, title, detail) VALUES(NULL,:title,:detail)";
                            $insert_stmt = $conn->prepare($insert_query);
                            $insert_stmt->bindValue(':title', htmlspecialchars(strip_tags($title)),PDO::PARAM_STR);
                            $insert_stmt->bindValue(':detail', htmlspecialchars(strip_tags($detail)),PDO::PARAM_STR);
                            $insert_stmt->execute();

                            //id da proposta
                            $last_id = $conn->lastInsertId();
                            
                            if($insert_stmt->rowCount()):

                                $insert_query = "INSERT INTO propostas_empresas (id_proposta, id_company, title, detail, company, street, email, website, supervisor, phone, aprovada) 
                                VALUES(:id_proposal,:id_company,:title,:detail,:company,:street,:email,:website,:supervisor,:phone,:aprovada)";
                                $insert_stmt = $conn->prepare($insert_query);
                                $insert_stmt->bindValue(':id_proposal', htmlspecialchars(strip_tags($last_id)), PDO::PARAM_STR);
                                $insert_stmt->bindValue(':id_company', htmlspecialchars(strip_tags($id_company)), PDO::PARAM_STR);
                                $insert_stmt->bindValue(':title', htmlspecialchars(strip_tags($title)), PDO::PARAM_STR);
                                $insert_stmt->bindValue(':detail', htmlspecialchars(strip_tags($detail)), PDO::PARAM_STR);
                                $insert_stmt->bindValue(':company', htmlspecialchars(strip_tags($company)), PDO::PARAM_STR);
                                $insert_stmt->bindValue(':street', htmlspecialchars(strip_tags($street)), PDO::PARAM_STR);
                                $insert_stmt->bindValue(':email', htmlspecialchars(strip_tags($email)), PDO::PARAM_STR);
                                $insert_stmt->bindValue(':website', htmlspecialchars(strip_tags($website)), PDO::PARAM_STR);
                                $insert_stmt->bindValue(':supervisor', htmlspecialchars(strip_tags($supervisor)), PDO::PARAM_STR);
                                $insert_stmt->bindValue(':phone', htmlspecialchars(strip_tags($phone)), PDO::PARAM_STR);
                                $insert_stmt->bindValue(':aprovada', htmlspecialchars(strip_tags($aprovada)), PDO::PARAM_STR);
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
                                        
                                        $email = strtolower($sigla) . "@isep.ipp.pt";
                                        $to = $email;
                                        //$to = "1181392@isep.ipp.pt";
                                        $subject = "Nova proposta de Estágio!";
                                        $body = "A empresa '{$company}' submeteu a proposta de estágio '{$title}'! Verifique o portal para mais detalhes!";

                                        smtpmailer($to, $subject, $body);

                                        $returnData = [
                                            'success' => 1,
                                            'auth' => $auth,
                                            'message' => 'Proposta submetida!'
                                        ];

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