<?php
header('Content-Type: application/json');

// Configura tus datos de conexión
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'festival_db'; // <-- Cambia aquí al nombre correcto

// Conexión a la base de datos
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión']);
    exit;
}

// Recibe los datos POST
$nombre = $conn->real_escape_string($_POST['nombre'] ?? '');
$email = $conn->real_escape_string($_POST['email'] ?? '');
$telefono = $conn->real_escape_string($_POST['telefono'] ?? '');
$cantidad = intval($_POST['cantidad_entradas'] ?? 0);

// Valida datos mínimos
if (!$nombre || !$email || !$telefono || $cantidad < 1) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit;
}

// Inserta en la base de datos
$sql = "INSERT INTO participantes_sorteo (nombre, email, telefono, cantidad_entradas)
        VALUES ('$nombre', '$email', '$telefono', $cantidad)";

if ($conn->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al guardar en la base de datos: ' . $conn->error]);
}

$conn->close();
?>