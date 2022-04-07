<?php

include_once __DIR__.'/../config.php';

class Database{
    
    // CHANGE THE DB INFO ACCORDING TO YOUR DATABASE
    private $db_host = db_host;
    private $db_name = db_name;
    private $db_username = db_username;
    private $db_password = db_password;
    
    public function dbConnection(){
        
        try{
            $conn = new PDO('mysql:host='.$this->db_host.';dbname='.$this->db_name,$this->db_username,$this->db_password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;
        }
        catch(PDOException $e){
            echo "Connection error ".$e->getMessage(); 
            exit;
        }
          
    }
}

?>