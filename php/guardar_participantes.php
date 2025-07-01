<?php
header('Content-Type: application/json');

// Configuración de la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "festival_db";

// Validar datos recibidos
$required_fields = ['nombre', 'email', 'telefono', 'cantidad_entradas'];
foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        echo json_encode(['success' => false, 'message' => "El campo $field es requerido"]);
        exit;
    }
}

// Sanitizar entradas
$nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);
$cantidad_entradas = filter_var($_POST['cantidad_entradas'], FILTER_VALIDATE_INT);

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'El email no es válido']);
    exit;
}

// Validar cantidad de entradas
if ($cantidad_entradas <= 0) {
    echo json_encode(['success' => false, 'message' => 'La cantidad de entradas debe ser mayor a 0']);
    exit;
}

try {
    // Crear conexión
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Preparar consulta
    $stmt = $conn->prepare("INSERT INTO participantes_sorteo 
                          (nombre, email, telefono, cantidad_entradas) 
                          VALUES (:nombre, :email, :telefono, :cantidad_entradas)");

    // Ejecutar consulta
    $stmt->execute([
        ':nombre' => $nombre,
        ':email' => $email,
        ':telefono' => $telefono,
        ':cantidad_entradas' => $cantidad_entradas
    ]);

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'message' => 'Registro guardado correctamente'
    ]);

} catch(PDOException $e) {
    // Manejar error de duplicado de email
    if ($e->errorInfo[1] == 1062) {
        echo json_encode(['success' => false, 'message' => 'Este email ya está registrado']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
    }
}
?>