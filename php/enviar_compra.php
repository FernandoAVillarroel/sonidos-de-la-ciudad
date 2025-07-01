<?php
file_put_contents(__DIR__ . '/debug.log', date('c') . " - Llego una petición\n", FILE_APPEND);
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $para = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $asunto = "Confirmación de compra - Sonidos de la Ciudad";
    $mensaje = "¡Gracias por tu compra!\n\n";
    $mensaje .= "Nombre: " . htmlspecialchars($_POST['nombre']) . "\n";
    $mensaje .= "Teléfono: " . htmlspecialchars($_POST['telefono']) . "\n";
    $mensaje .= "Fecha de nacimiento: " . htmlspecialchars($_POST['nacimiento']) . "\n";
    $mensaje .= "País: " . htmlspecialchars($_POST['pais']) . "\n";
    $mensaje .= "Evento: " . htmlspecialchars($_POST['evento']) . "\n";
    $mensaje .= "Fecha del evento: " . htmlspecialchars($_POST['fecha_evento']) . "\n";
    $mensaje .= "Ubicación: " . htmlspecialchars($_POST['ubicacion_evento']) . "\n";
    $mensaje .= "Tipo de entrada: " . htmlspecialchars($_POST['tipo_entrada']) . "\n";
    $mensaje .= "Cantidad: " . htmlspecialchars($_POST['cantidad']) . "\n";
    $mensaje .= "Total: " . htmlspecialchars($_POST['precio_total']) . "\n";

    $cabeceras = "From: info@festival.com\r\n";
    if ($para) {
        mail($para, $asunto, $mensaje, $cabeceras);
        echo "<script>alert('¡Compra realizada con éxito! Revisa tu correo.');window.location='../entradas.html';</script>";
    } else {
        echo "<script>alert('Correo inválido.');window.history.back();</script>";
    }
} else {
    header("Location: ../entradas.html");
    exit;
}
?>