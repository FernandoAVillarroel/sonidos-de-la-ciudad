<?php
header('Content-Type: application/json');
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = htmlspecialchars($_POST['nombre']);
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $asunto = htmlspecialchars($_POST['asunto']);
    $mensaje = htmlspecialchars($_POST['mensaje']);

    $para = "info@festival.com";
    $asunto_mail = "Contacto desde la web: $asunto";
    $mensaje_mail = "Nombre: $nombre\n";
    $mensaje_mail .= "Correo: $email\n";
    $mensaje_mail .= "Mensaje:\n$mensaje\n";

    $cabeceras = "From: $email\r\nReply-To: $email\r\n";

    if ($email && mail($para, $asunto_mail, $mensaje_mail, $cabeceras)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Error al enviar el mensaje."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Método no permitido."]);
}
?>