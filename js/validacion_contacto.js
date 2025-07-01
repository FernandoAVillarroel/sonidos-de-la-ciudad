document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM cargado');
  console.log(document.getElementById('modal-exito'));
  const form = document.querySelector('form');
  const inputs = form.querySelectorAll('input, textarea');
  const btn = form.querySelector('button[type="submit"]');

  // Crear contenedores de mensajes de error/success
  inputs.forEach(input => {
    const msg = document.createElement('div');
    msg.className = 'mensaje-validacion';
    msg.style.fontSize = '0.95em';
    msg.style.marginBottom = '0.5em';
    input.insertAdjacentElement('afterend', msg);
  });

  // Mensaje general arriba del botón
  const generalMsg = document.createElement('div');
  generalMsg.className = 'mensaje-general';
  generalMsg.style.margin = '1em 0 0.5em 0';
  generalMsg.style.fontWeight = 'bold';
  form.querySelector('button[type="submit"]').insertAdjacentElement('beforebegin', generalMsg);

  // Validaciones individuales
  function validarNombre(valor) {
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (valor.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.';
    if (!nombreRegex.test(valor.trim())) return 'El nombre solo puede contener letras y espacios.';
    return '';
  }
  function validarEmail(valor) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(valor.trim())) return 'El correo electrónico no es válido.';
    return '';
  }
  function validarAsunto(valor) {
    if (valor.trim().length === 0) return 'El asunto no puede estar vacío.';
    return '';
  }
  function validarMensaje(valor) {
    if (valor.trim().length === 0) return 'El mensaje no puede estar vacío.';
    return '';
  }

  // Asocia cada campo con su función de validación
  const validadores = {
    nombre: validarNombre,
    email: validarEmail,
    asunto: validarAsunto,
    mensaje: validarMensaje
  };

  // Validación en tiempo real
  function validarCampo(input) {
    const validador = validadores[input.name];
    const mensaje = validador ? validador(input.value) : '';
    const msgDiv = input.nextElementSibling;
    if (mensaje) {
      input.style.borderColor = 'red';
      msgDiv.textContent = mensaje;
      msgDiv.style.color = 'red';
      return false;
    } else {
      input.style.borderColor = 'green';
      msgDiv.textContent = '¡Correcto!';
      msgDiv.style.color = 'green';
      return true;
    }
  }

  // Validar todos los campos y mostrar mensaje general si hay errores
  function validarFormulario() {
    let todoValido = true;
    let primerError = '';
    inputs.forEach(input => {
      const valido = validarCampo(input);
      if (!valido && !primerError) {
        primerError = input.nextElementSibling.textContent;
      }
      todoValido = todoValido && valido;
    });
    if (!todoValido) {
      generalMsg.textContent = 'Por favor, corrige los errores antes de enviar el formulario: ' + primerError;
      generalMsg.style.color = 'red';
      btn.disabled = true;
    } else {
      generalMsg.textContent = '';
      btn.disabled = false;
    }
    return todoValido;
  }

  // Eventos en tiempo real
  inputs.forEach(input => {
    input.addEventListener('input', function () {
      validarCampo(input);
      validarFormulario();
    });
    // Validar al cargar por si hay autocompletado
    validarCampo(input);
  });

  // Validar todo al inicio
  validarFormulario();

  // Envío AJAX y mostrar modal de éxito
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validarFormulario()) return;

    const formData = new FormData(form);
    fetch('php/enviar_contacto.php', {
      method: 'POST',
      body: formData
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        document.getElementById('modal-exito').style.display = 'flex';
        form.reset();
        inputs.forEach(input => {
          input.style.borderColor = '';
          input.nextElementSibling.textContent = '';
        });
        generalMsg.textContent = '';
        btn.disabled = true;
      } else {
        generalMsg.textContent = data.error || 'Error al enviar el mensaje.';
        generalMsg.style.color = 'red';
      }
    })
    .catch(() => {
      generalMsg.textContent = 'Error al enviar el mensaje.';
      generalMsg.style.color = 'red';
    });
  });

  // Cerrar el modal de éxito
  const cerrarModal = document.getElementById('cerrar-modal-exito');
  if (cerrarModal) {
    cerrarModal.onclick = function () {
      document.getElementById('modal-exito').style.display = 'none';
    };
  }
});