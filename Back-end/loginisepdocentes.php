<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

ini_set('session.gc_maxlifetime', 28800);

function msg($success,$status,$message,$extra = []){
    return array_merge([
        'success' => $success,
        'status' => $status,
        'message' => $message
    ],$extra);
}

require __DIR__.'/classes/Database.php';
require __DIR__.'/classes/JwtHandler.php';

$db_connection = new Database();
$conn = $db_connection->dbConnection();

$data = json_decode(file_get_contents("php://input"));
$returnData = [];

// IF REQUEST METHOD IS NOT EQUAL TO POST
if($_SERVER["REQUEST_METHOD"] != "POST"):
    $returnData = msg(0,404,'Page Not Found!');

// CHECKING EMPTY FIELDS
elseif(!isset($data->email) 
    || !isset($data->password)
    || !isset($data->username)
    || empty(trim($data->email))
    || empty(trim($data->password))
    || empty(trim($data->username))
    ):

    $fields = ['fields' => ['email','password','username']];
    $returnData = msg(0,422,'Please Fill in all Required Fields!',$fields);

// IF THERE ARE NO EMPTY FIELDS THEN-
else:
    $email = trim($data->email);
    $password = trim($data->password);
    $username = trim($data->username);

    try{
            
        /*$fetch_user_by_email = "SELECT * FROM `users` WHERE `email`=:email";
        $query_stmt = $conn->prepare($fetch_user_by_email);
        $query_stmt->bindValue(':email', $email,PDO::PARAM_STR);
        $query_stmt->execute();

        // IF THE USER IS FOUNDED BY EMAIL
        if($query_stmt->rowCount()):
            $row = $query_stmt->fetch(PDO::FETCH_ASSOC);
            $check_password = password_verify($password, $row['password']);

            // VERIFYING THE PASSWORD (IS CORRECT OR NOT?)
            // IF PASSWORD IS CORRECT THEN SEND THE LOGIN TOKEN
            if($check_password):

                //Check If Director
                $fetch_director = "SELECT * FROM `diretores` 
                JOIN `cursos` ON cursos.id_curso = diretores.id_curso
                WHERE sigla = :username";
                $search_stmt = $conn->prepare($fetch_director);
                $search_stmt->bindValue(':username', $username,PDO::PARAM_STR);
                $search_stmt->execute();

                if($search_stmt->rowCount()):
                    while($row = $search_stmt->fetch(PDO::FETCH_ASSOC)) {
                        $id_curso = $row['id_curso'];
                        $nome_curso = $row['nome_curso'];
                    }

                    $jwt = new JwtHandler();
                    $token = $jwt->_jwt_encode_data(
                        website,
                        array("username" => $username, "usertype" => "diretor", "id_curso" => $id_curso, "nome_curso" => $nome_curso)
                    );

                else:
                    $jwt = new JwtHandler();
                    $token = $jwt->_jwt_encode_data(
                    website,
                    array("username" => $username, "usertype" => "docente")
                    );
                endif;

                session_start();
                $_SESSION['token'] = $token;
                
                $returnData = [
                    'success' => 1,
                    'message' => 'You have successfully logged in.',
                    'sessionID' => session_id()
                ];

            // IF INVALID PASSWORD
            else:
                $returnData = msg(0,422,'Invalid Password!');
            
            endif;

        // IF THE USER IS NOT FOUNDED BY EMAIL THEN SHOW THE FOLLOWING ERROR
        else:
            $returnData = msg(0,422,'Invalid Email Address!');
        
        endif;*/

        ////dnf install php-pecl-ssh2
        $ssh_conn = ssh2_connect('ave.dee.isep.ipp.pt', 22);

        if ($ssh_conn):

            if (@ssh2_auth_password($ssh_conn, $username, $password)):
                $valid_login = true;
            
            else:
                $returnData = [
                    'success' => 0,
                    'message' => 'Unauthorized.'
                ];
            
            endif;
            
            ssh2_disconnect($ssh_conn);

        endif;

        if($valid_login == true):
            //Check If Director
            $fetch_director = "SELECT * FROM `diretores` 
            JOIN `cursos` ON cursos.id_curso = diretores.id_curso
            WHERE sigla = :username";
            $search_stmt = $conn->prepare($fetch_director);
            $search_stmt->bindValue(':username', $username,PDO::PARAM_STR);
            $search_stmt->execute();

            if($search_stmt->rowCount()):
                while($row = $search_stmt->fetch(PDO::FETCH_ASSOC)) {
                    $id_curso = $row['id_curso'];
                    $nome_curso = $row['nome_curso'];
                }

                $jwt = new JwtHandler();
                $token = $jwt->_jwt_encode_data(
                    website,
                    array("username" => $username, "usertype" => "diretor", "id_curso" => $id_curso, "nome_curso" => $nome_curso)
                );

            else:
                $jwt = new JwtHandler();
                $token = $jwt->_jwt_encode_data(
                website,
                array("username" => $username, "usertype" => "docente")
                );
            endif;

            session_start();
            $_SESSION['token'] = $token;
            
            $returnData = [
                'success' => 1,
                'message' => 'You have successfully logged in.',
                'sessionID' => session_id()
            ];

        endif;
    }

    catch(PDOException $e){
        $returnData = msg(0,500,$e->getMessage());
    }

endif;

echo json_encode($returnData);

?>