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

            if ($usertype == "empresa"):

                $id_company = $data['id_company'];

                // CHECKING EMPTY FIELDS
                if(!isset($id_company) 
                    || empty(trim($id_company))
                    ):
    
                    $returnData = [
                        'success' => 0,
                        'errorMsg' => 'EMPTY'
                    ]; 

                // IF THERE ARE NO EMPTY FIELDS THEN-
                else:

                    $company = [];
                    $street = [];
                    $website = [];
                    $supervisor = [];
                    $phone = [];

                    try {
                        
                        $fetch_internships = "SELECT company, street, website, representante, phone, email
                        FROM `empresas` 
                        WHERE `id_company`=:id_company";
                        $search_stmt = $conn->prepare($fetch_internships);
                        $search_stmt->bindValue(':id_company', $id_company, PDO::PARAM_STR);
                        $search_stmt->execute();

                        if($search_stmt->rowCount()):
                            while($row = $search_stmt->fetch(PDO::FETCH_ASSOC)) {
                                $company = $row["company"];
                                $street = $row["street"];
                                $website = $row["website"];
                                $supervisor = $row["representante"];
                                $phone = $row["phone"];
                                $email = $row["email"];
                            }

                        endif;

                        $returnData = [
                            'success' => 1,
                            'auth' => $auth,
                            'company' => $company,
                            'street' => $street,
                            'website' => $website,
                            'supervisor' => $supervisor,
                            'phone' => $phone,
                            'email' => $email
                        ];
                        
                    }  

                    catch(PDOException $e){
                        $returnData = msg(0,500,$e->getMessage());
                    }

                endif;
            
            else:

                $returnData = [
                    'success' => 0,
                    'message' => 'Unauthorized1'
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