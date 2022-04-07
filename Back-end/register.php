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
require __DIR__.'/classes/Database.php';
$db_connection = new Database();
$conn = $db_connection->dbConnection();

// GET DATA FORM REQUEST
$data = json_decode(file_get_contents("php://input"));
$returnData = [];

// IF REQUEST METHOD IS NOT POST
if($_SERVER["REQUEST_METHOD"] != "POST"):
    $returnData = msg(0,404,'Page Not Found!');

// CHECKING EMPTY FIELDS
elseif(!isset($data->name) 
    || !isset($data->street)
    || !isset($data->website)
    || !isset($data->supervisor)
    || !isset($data->phone)
    || !isset($data->email)
    || !isset($data->password)
    || empty(trim($data->name))
    || empty(trim($data->street))
    || empty(trim($data->website))
    || empty(trim($data->supervisor))
    || empty(trim($data->phone))
    || empty(trim($data->email))
    || empty(trim($data->password))
    ):

    $fields = ['fields' => ['name','email','password']];
    $returnData = msg(0,422,'Please Fill in all Required Fields!',$fields);

// IF THERE ARE NO EMPTY FIELDS THEN-
else:
    
    $name = trim($data->name);
    $street = trim($data->street);
    $website = trim($data->website);
    $supervisor = trim($data->supervisor);
    $phone = trim($data->phone);
    $email = trim($data->email);
    $password = trim($data->password);

    if(!filter_var($email, FILTER_VALIDATE_EMAIL)):
        $returnData = msg(0,422,'Email inválido!');

    else:
        try{

            $check_email = "SELECT `email` FROM `users` WHERE `email`=:email";
            $check_email_stmt = $conn->prepare($check_email);
            $check_email_stmt->bindValue(':email', $email,PDO::PARAM_STR);
            $check_email_stmt->execute();

            if($check_email_stmt->rowCount()):
                $returnData = msg(0,422, 'Email já se encontra registado!');
            
            else:
                $insert_query = "INSERT INTO `users`(`name`,`email`,`password`) VALUES(:name,:email,:password)";
                $insert_stmt = $conn->prepare($insert_query);
                $insert_stmt->bindValue(':name', htmlspecialchars(strip_tags($name)),PDO::PARAM_STR);
                $insert_stmt->bindValue(':email', $email,PDO::PARAM_STR);
                $insert_stmt->bindValue(':password', password_hash($password, PASSWORD_DEFAULT),PDO::PARAM_STR);
                $insert_stmt->execute();

                //id
                $last_id = $conn->lastInsertId();

                if($insert_stmt->rowCount()):
                    $insert_query = "INSERT INTO `empresas`(`id_company`,`uid`,`company`,`street`,`email`,`website`,`representante`,`phone`) VALUES(NULL,:last_id,:name,:street,:email,:website,:supervisor,:phone)";
                    $insert_stmt = $conn->prepare($insert_query);
                    $insert_stmt->bindValue(':last_id', $last_id,PDO::PARAM_STR);
                    $insert_stmt->bindValue(':name', htmlspecialchars(strip_tags($name)),PDO::PARAM_STR);
                    $insert_stmt->bindValue(':street', htmlspecialchars(strip_tags($street)),PDO::PARAM_STR);
                    $insert_stmt->bindValue(':website', htmlspecialchars(strip_tags($website)),PDO::PARAM_STR);
                    $insert_stmt->bindValue(':supervisor', htmlspecialchars(strip_tags($supervisor)),PDO::PARAM_STR);
                    $insert_stmt->bindValue(':phone', htmlspecialchars(strip_tags($phone)),PDO::PARAM_STR);
                    $insert_stmt->bindValue(':email', $email,PDO::PARAM_STR);
                    $insert_stmt->execute();

                    if($insert_stmt->rowCount()):
                        
                        $returnData = [
                            'success' => 1,
                            'message' => 'Registo efetuado!'
                        ];

                    else:

                        $returnData = [
                            'success' => 0,
                            'message' => 'Erro! Tente novamente!'
                        ];

                    endif;

                else:

                    $returnData = [
                        'success' => 0,
                        'message' => 'Erro! Tente novamente!'
                    ];

                endif;

            endif;

        }
        catch(PDOException $e){
            $returnData = msg(0,500,$e->getMessage());
        }
    endif;
    
endif;

echo json_encode($returnData);

?>