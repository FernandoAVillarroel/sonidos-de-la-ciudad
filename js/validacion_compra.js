// Datos de eventos
const eventos = [
    {
        "evento": "Concierto de rock",
        "fecha": "2024-07-10",
        "lugar": "Estadio Madre de Ciudades",
        "ciudad": "Santiago del Estero",
        "horario": "21:00",
        "artista": "Los Redonditos de Ricota (tributo)",
        "genero": "Rock",
        "precio": 1500,
        "moneda": "ARS",
        "entradas_disponibles": 500
    },
    {
        "evento": "Festival de Música Electrónica",
        "fecha": "2024-07-15",
        "lugar": "Complejo Urbano",
        "ciudad": "Santiago del Estero",
        "horario": "18:00",
        "artista": "Varios DJs",
        "genero": "Electrónica",
        "precio": 2000,
        "moneda": "ARS",
        "entradas_disponibles": 1000
    },
    {
        "evento": "Noche de Jazz",
        "fecha": "2024-07-20",
        "lugar": "Bar Cultural La Ferretería",
        "ciudad": "Santiago del Estero",
        "horario": "22:00",
        "artista": "Trío de Jazz local",
        "genero": "Jazz",
        "precio": 800,
        "moneda": "ARS",
        "entradas_disponibles": 100
    }
];

// Abrir y cerrar modal de compra
document.getElementById('abrir-modal-entradas').onclick = function (e) {
    e.preventDefault();
    document.getElementById('modal-entradas').style.display = 'flex';
};
document.getElementById('cerrar-modal').onclick = function () {
    document.getElementById('modal-entradas').style.display = 'none';
};

// Rellenar eventos
const selectEvento = document.getElementById('evento-select');
eventos.forEach((ev, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${ev.evento} – ${ev.fecha} – ${ev.lugar}`;
    selectEvento.appendChild(opt);
});

// Actualizar campos de evento
selectEvento.onchange = function () {
    const ev = eventos[this.value];
    document.getElementById('fecha-evento').value = ev ? ev.fecha : '';
    document.getElementById('ubicacion-evento').value = ev ? `${ev.lugar}, ${ev.ciudad}` : '';
};
selectEvento.selectedIndex = 0;
selectEvento.onchange();

// --- Validación en tiempo real y feedback visual ---
const form = document.getElementById('form-entradas');
const campos = [
    "nombre", "email", "telefono", "nacimiento", "pais",
    "evento", "cantidad", "tarjeta", "vencimiento", "cvv", "nombre_tarjeta"
];
const btnSubmit = form.querySelector('button[type="submit"]');
const mensajeGeneral = document.getElementById('mensaje-formulario');

// Mensajes de error por campo
const mensajesError = {
    nombre: "Nombre inválido (mínimo 3 letras, solo letras y espacios).",
    email: "Correo electrónico inválido.",
    telefono: "El teléfono debe tener 10 dígitos.",
    nacimiento: "Debes ser mayor de 18 años.",
    pais: "Selecciona un país.",
    evento: "Selecciona un evento.",
    cantidad: "La cantidad debe ser entre 1 y 6.",
    tarjeta: "Número de tarjeta inválido (16 dígitos).",
    vencimiento: "Fecha de vencimiento inválida o vencida (MM/AA).",
    cvv: "CVV inválido (3 o 4 dígitos).",
    nombre_tarjeta: "Nombre en la tarjeta inválido."
};

// Validadores
const validadores = {
    nombre: v => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/.test(v.trim()),
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    telefono: v => /^\d{10}$/.test(v.trim()),
    nacimiento: v => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
        const [yyyy, mm, dd] = v.split('-');
        const fechaNac = new Date(`${yyyy}-${mm}-${dd}`);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        if (
            hoy.getMonth() < fechaNac.getMonth() ||
            (hoy.getMonth() === fechaNac.getMonth() && hoy.getDate() < fechaNac.getDate())
        ) edad--;
        return edad >= 18;
    },
    pais: v => !!v,
    evento: v => v !== "",
    cantidad: v => /^\d+$/.test(v) && +v >= 1 && +v <= 6,
    tarjeta: v => /^\d{16}$/.test(v.trim()),
    vencimiento: v => {
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(v.trim())) return false;
        const [mes, anio] = v.split('/');
        const fechaVenc = new Date(`20${anio}`, mes);
        return fechaVenc > new Date();
    },
    cvv: v => /^\d{3,4}$/.test(v.trim()),
    nombre_tarjeta: v => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(v.trim())
};

// Crear mensajes debajo de cada input
campos.forEach(campo => {
    const input = form.elements[campo];
    if (!input) return;
    let msg = document.createElement('div');
    msg.className = 'mensaje-validacion';
    msg.id = `msg-${campo}`;
    input.parentNode.insertBefore(msg, input.nextSibling);
});

// Validación en tiempo real
function validarCampo(campo) {
    const input = form.elements[campo];
    const valor = input.value;
    const valido = validadores[campo](valor);
    const msg = document.getElementById(`msg-${campo}`);
    if (valido) {
        input.style.borderColor = "#4caf50";
        msg.textContent = "✓";
        msg.style.color = "#4caf50";
    } else {
        input.style.borderColor = "#ff6f61";
        msg.textContent = mensajesError[campo];
        msg.style.color = "#ff6f61";
    }
    return valido;
}

// Validar todo el formulario y mostrar mensaje general
function validarFormulario() {
    let todoValido = true;
    let primerError = "";
    campos.forEach(campo => {
        const valido = validarCampo(campo);
        if (!valido && !primerError) primerError = mensajesError[campo];
        todoValido = todoValido && valido;
    });
    if (!todoValido) {
        mensajeGeneral.textContent = primerError;
        mensajeGeneral.style.color = "#ff6f61";
        btnSubmit.disabled = true;
    } else {
        mensajeGeneral.textContent = "";
        btnSubmit.disabled = false;
    }
    return todoValido;
}

// Eventos de validación en tiempo real
campos.forEach(campo => {
    const input = form.elements[campo];
    if (!input) return;
    input.addEventListener('input', () => {
        validarCampo(campo);
        validarFormulario();
    });
});

// Deshabilitar el botón al inicio
btnSubmit.disabled = true;

// Mostrar mensaje general al inicio
mensajeGeneral.textContent = "Completa todos los campos correctamente para habilitar la compra.";
mensajeGeneral.style.color = "#ff6f61";

// Validar al cargar por si hay autocompletado
window.addEventListener('DOMContentLoaded', validarFormulario);

// Validación final al enviar
form.onsubmit = function (e) {
    e.preventDefault();
    if (!validarFormulario()) return false;

    // Prepara los datos del formulario
    const formData = new FormData(form);

    const nombre = formData.get('nombre');
    const email = formData.get('email');
    const telefono = formData.get('telefono');
    const cantidad = formData.get('cantidad');
    guardarParticipante(nombre, email, telefono, cantidad);

    // Envía los datos al backend PHP
    fetch('php/enviar_compra.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            // Cerrar el modal de compra
            document.getElementById('modal-entradas').style.display = 'none';

            // Mostrar el modal de éxito
            document.getElementById('modal-exito').style.display = 'flex';

            // Mostrar mensaje de éxito fuera del modal (opcional)
            mensajeGeneral.style.color = 'green';
            mensajeGeneral.textContent = '¡Compra realizada con éxito!';

            // Mostrar el resumen de la última compra realizada
            const eventoIdx = form.elements["evento"].value;
            const tipo = form.elements["tipo_entrada"] ? form.elements["tipo_entrada"].value : "General";
            const cantidad = form.elements["cantidad"].value;
            const total = document.getElementById('precio_total_hidden').value;

            let resumen = document.getElementById('resumen-compra');
            if (!resumen) {
                resumen = document.createElement('div');
                resumen.id = 'resumen-compra';
                resumen.style.background = "#fff";
                resumen.style.border = "1px solid #ffb347";
                resumen.style.borderRadius = "0.7em";
                resumen.style.padding = "1em";
                resumen.style.margin = "1em 0";
                btnSubmit.parentNode.insertBefore(resumen, btnSubmit);
            }
            if (eventos[eventoIdx]) {
                resumen.innerHTML = `
              <strong>Resumen de compra:</strong><br>
              Evento: ${eventos[eventoIdx].evento}<br>
              Fecha: ${eventos[eventoIdx].fecha}<br>
              Ubicación: ${eventos[eventoIdx].lugar}, ${eventos[eventoIdx].ciudad}<br>
              Tipo de entrada: ${tipo}<br>
              Cantidad: ${cantidad}<br>
              <b>${total}</b>
            `;
            } else {
                resumen.innerHTML = "";
            }

            form.reset();
            selectEvento.selectedIndex = 0;
            selectEvento.onchange();
            validarFormulario();
            actualizarPrecioTotal();
        })
        .catch(error => {
            mensajeGeneral.style.color = 'red';
            mensajeGeneral.textContent = 'Error al enviar la compra. Intenta de nuevo.';
        });

    return false;
};


function detectarTipoTarjeta(numero) {
    const img = document.getElementById('img-tarjeta');
    let tipo = "";
    if (/^4/.test(numero)) tipo = "visa";
    else if (/^5[1-5]/.test(numero)) tipo = "mastercard";
    else tipo = "";
    if (img) {
        img.style.display = tipo ? "inline-block" : "none";
        img.src = tipo ? `assets/img/tarjetas/${tipo}.png` : "";
        img.alt = tipo ? tipo : "";
    }
}

form.elements["tarjeta"].addEventListener('input', function () {
    detectarTipoTarjeta(this.value);
});

// --- Mostrar precio total actualizado ---
function actualizarPrecioTotal() {
    const eventoIdx = form.elements["evento"].value;
    const tipo = form.elements["tipo_entrada"] ? form.elements["tipo_entrada"].value : "General";
    const cantidad = parseInt(form.elements["cantidad"].value, 10) || 1;
    let precioBase = 0;
    if (eventos[eventoIdx]) {
        precioBase = eventos[eventoIdx].precio;
        if (tipo === "VIP") precioBase *= 1.8;
        if (tipo === "Palco") precioBase *= 2.5;
    }
    const total = precioBase * cantidad;
    let precioTotal = document.getElementById('precio-total');
    if (!precioTotal) {
        precioTotal = document.createElement('div');
        precioTotal.id = 'precio-total';
        precioTotal.style.margin = "1em 0";
        btnSubmit.parentNode.insertBefore(precioTotal, btnSubmit);
    }
    precioTotal.textContent = total ? `Total: $${total} ARS` : "";
    document.getElementById('precio_total_hidden').value = total ? `$${total} ARS` : "";
}

// --- Mostrar resumen de compra ---
function actualizarResumen() {
    let resumen = document.getElementById('resumen-compra');
    if (!resumen) {
        resumen = document.createElement('div');
        resumen.id = 'resumen-compra';
        resumen.style.background = "#fff";
        resumen.style.border = "1px solid #ffb347";
        resumen.style.borderRadius = "0.7em";
        resumen.style.padding = "1em";
        resumen.style.margin = "1em 0";
        btnSubmit.parentNode.insertBefore(resumen, btnSubmit);
    }
    const eventoIdx = form.elements["evento"].value;
    const tipo = form.elements["tipo_entrada"] ? form.elements["tipo_entrada"].value : "General";
    const cantidad = form.elements["cantidad"].value;
    if (eventos[eventoIdx]) {
        resumen.innerHTML = `
          <strong>Resumen de compra:</strong><br>
          Evento: ${eventos[eventoIdx].evento}<br>
          Fecha: ${eventos[eventoIdx].fecha}<br>
          Ubicación: ${eventos[eventoIdx].lugar}, ${eventos[eventoIdx].ciudad}<br>
          Tipo de entrada: ${tipo}<br>
          Cantidad: ${cantidad}
        `;
    } else {
        resumen.innerHTML = "";
    }
}

// --- Actualizar precio y resumen en tiempo real ---
["evento", "tipo_entrada", "cantidad"].forEach(campo => {
    const input = form.elements[campo];
    if (input) {
        input.addEventListener('input', () => {
            actualizarPrecioTotal();
            actualizarResumen();
        });
    }
});

// Inicializar al cargar
window.addEventListener('DOMContentLoaded', () => {
    validarFormulario();
    actualizarPrecioTotal();
    actualizarResumen();
});

// Cerrar el modal de éxito al hacer click en la X o en el botón
document.getElementById('cerrar-modal-exito').onclick = function () {
    document.getElementById('modal-exito').style.display = 'none';
};
document.getElementById('cerrar-modal-exito-btn').onclick = function () {
    document.getElementById('modal-exito').style.display = 'none';
};
// También cerrar si se hace click fuera del contenido
window.addEventListener('click', function (event) {
    const modalExito = document.getElementById('modal-exito');
    if (event.target === modalExito) modalExito.style.display = "none";
    const modalEntradas = document.getElementById('modal-entradas');
    if (event.target === modalEntradas) modalEntradas.style.display = "none";
});

async function guardarParticipante(nombre, email, telefono, cantidad) {
    const datos = new URLSearchParams();
    datos.append('nombre', nombre);
    datos.append('email', email);
    datos.append('telefono', telefono);
    datos.append('cantidad_entradas', cantidad);

    try {
        const response = await fetch('guardar_participantes.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: datos.toString()
        });
        const resultado = await response.json();
        if (!resultado.success) {
            console.warn("Error al guardar participante:", resultado.message);
        }
    } catch (error) {
        console.warn("Error al conectar con guardar_participantes.php:", error);
    }
}