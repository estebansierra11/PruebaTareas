<?php
session_start(); // Iniciar sesión
include 'config.php';


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");


$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['external'])) {
            fetchExternalAPI();
        } else if (isset($_GET['action']) && $_GET['action'] == 'logout') {
            logout();
        }else {
            //$sesion=$_SESSION ['username'];
            //$username = isset($_GET['username']) ? $_GET['username'] : null;
            getTasks($conn);
        }
        break;
    case 'POST':
        if (isset($_GET['action']) && $_GET['action'] == 'login') {
            login($conn);
        } else if (isset($_GET['action']) && $_GET['action'] == 'register') {
            register($conn);
        } else {
            addTask($conn);
        }
        break;
    case 'PUT':
        updateTask($conn);
        break;
    case 'DELETE':
        deleteTask($conn);
        break;
    default:
        echo json_encode(['message' => 'NO']);
        break;
}

function fetchExternalAPI() {
    // Función para consumir API externa
}



function addTask($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    $task = $data['task'];
    //$username = $data['username'];
    $id = $data['id'];
    $sql = "INSERT INTO tasks (task, user_id, completed) VALUES ('$task', $id, 'Pendiente')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['message' => 'Tarea agregada']);
    } else {
        echo json_encode(['message' => 'Error']);
    }
}

function updateTask($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'];
    $task = $data['task'];
    $completed = $data['completed'];

    if ($completed == 1) {
        $sql = "UPDATE tasks SET completed='Hecha' WHERE id=$id";
    } else {
        $sql = "UPDATE tasks SET task='$task' WHERE id=$id";
    }

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['message' => $sql]);
    } else {
        echo json_encode(['message' => 'Error updating task']);
    }
}


function deleteTask($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'];
    $sql = "DELETE FROM tasks WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['message' => 'Tarea eliminada']);
    } else {
        echo json_encode(['message' => 'Error']);
    }
}

function register($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    $username = $data['username'];
    $password = password_hash($data['password'], PASSWORD_BCRYPT);

  
    $sql_check = "SELECT * FROM users WHERE username='$username'";
    $result_check = $conn->query($sql_check);

    if ($result_check->num_rows > 0) {
        echo json_encode(['message' => 'El usuario ya existe']);
        return;
    }

    $sql = "INSERT INTO users (username, password) VALUES ('$username', '$password')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['message' => 'Usuario registrado']);
    } else {
        echo json_encode(['message' => 'Error al registrar']);
    }
}

function login($conn) {
  
    $data = json_decode(file_get_contents("php://input"), true);
    $username = $data['username'];
    $password = $data['password'];

   
    $sql = "SELECT id, username, password FROM users WHERE username='$username'";
    $result = $conn->query($sql);

   
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        
        if (password_verify($password, $user['password'])) {
           
            $_SESSION['id'] = $user['id'];
            $_SESSION['username'] = $user['username'];

           
            echo json_encode([
                'message' => 'Login successful',
                'id' => $_SESSION['id'],
                'username' => $_SESSION['username']
            ]);
        } else {
            echo json_encode(['message' => 'Contraseña Invalida']);
        }
    } else {
        echo json_encode(['message' => 'El usuario no exiuuuuuste']);
    }
}


function getTasks($conn) {
   // $data = json_decode(file_get_contents("php://input"), true);
    //$username = $data['username'];}
    $username = $_GET['username'];
    $sql = "SELECT t.id, t.task, 
            t.completed
            FROM tasks t 
            INNER JOIN users u 
            ON t.user_id = u.id 
            WHERE u.username = '$username'
            ORDER BY t.id asc;";
    $result = $conn->query($sql);

    $tasks = array();
    while ($row = $result->fetch_assoc()) {
        $tasks[] = $row;
    }

    echo json_encode($tasks);
}

function logout() {
    session_destroy();
    session_unset();
    echo json_encode(['message' => 'Cerró sesión exitosamente']);
}
?>
