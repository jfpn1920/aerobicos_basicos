// ===== Configuración inicial =====
const CLAVE = "aerobicosBasicos"; // clave con la que se guarda en localStorage
let datos = { nombre: "", ejercicios: {} }; // toda la información de la app
// ===== Referencias a elementos del HTML =====
const inputNombre = document.getElementById("nombre");
const saludo = document.getElementById("saludo");
const tarjetas = document.querySelectorAll(".tarjeta");
const relleno = document.getElementById("relleno");
const textoProgreso = document.getElementById("textoProgreso");
const btnReiniciar = document.getElementById("btnReiniciar");
// ===== Funciones de localStorage =====
// Lee los datos guardados (si existen) al abrir o refrescar la página
function cargarDatos() {
    try {
        const guardado = localStorage.getItem(CLAVE);
      if (guardado) datos = JSON.parse(guardado); // convierte el texto en objeto
    } catch (error) {
        console.error("No se pudieron leer los datos:", error);
    }
}
// Guarda el objeto "datos" como texto en localStorage
function guardarDatos() {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
}
// ===== Funciones de apoyo =====
// Devuelve los datos de un ejercicio; si no existen, los crea vacíos
function obtenerEjercicio(id) {
    if (!datos.ejercicios[id]) datos.ejercicios[id] = { minutos: "", hecho: false };
    return datos.ejercicios[id];
}
// ===== Funciones que actualizan la pantalla =====
// Muestra el saludo según el nombre guardado
function pintarSaludo() {
    inputNombre.value = datos.nombre;
    saludo.textContent = datos.nombre ? "¡Vamos, " + datos.nombre + "!" : "";
}
// Dibuja una tarjeta con sus datos guardados
function pintarTarjeta(tarjeta) {
    const ejercicio = obtenerEjercicio(tarjeta.dataset.id);
    const estado = tarjeta.querySelector(".estado");
    tarjeta.querySelector(".minutos").value = ejercicio.minutos; // restaura minutos
    tarjeta.classList.toggle("hecha", ejercicio.hecho); // pinta si está hecha
    tarjeta.querySelector(".btn-hecho").textContent = ejercicio.hecho ? "Desmarcar" : "Marcar como hecho";
    estado.textContent = ejercicio.hecho ? "¡Completado!" : "Pendiente";
}
// Calcula ejercicios hechos y minutos totales
function pintarProgreso() {
    let hechos = 0, totalMinutos = 0; // contadores en cero
    tarjetas.forEach(function (tarjeta) {
        const ejercicio = obtenerEjercicio(tarjeta.dataset.id);
        if (ejercicio.hecho) hechos++;
        totalMinutos += Number(ejercicio.minutos) || 0;
    });
    // La barra se llena según el porcentaje de ejercicios hechos
    relleno.style.width = (hechos / tarjetas.length) * 100 + "%";
    textoProgreso.textContent =
        hechos + " de " + tarjetas.length + " hechos, " + totalMinutos + " minutos";
}
// Redibuja toda la página
function pintarTodo() {
    pintarSaludo();
    tarjetas.forEach(pintarTarjeta);
    pintarProgreso();
}
// ===== Eventos =====
// Cuando se escribe el nombre, se guarda al instante
inputNombre.addEventListener("input", function () {
    datos.nombre = inputNombre.value.trim();
    guardarDatos();
    pintarSaludo();
});
// Eventos de cada tarjeta
tarjetas.forEach(function (tarjeta) {
    const id = tarjeta.dataset.id;
    // Al cambiar los minutos, se guardan
    tarjeta.querySelector(".minutos").addEventListener("input", function (e) {
        obtenerEjercicio(id).minutos = e.target.value;
        guardarDatos();
        pintarProgreso();
    });
    // Al pulsar el botón, se cambia entre hecho y pendiente
    tarjeta.querySelector(".btn-hecho").addEventListener("click", function () {
        const ejercicio = obtenerEjercicio(id);
        ejercicio.hecho = !ejercicio.hecho;
        guardarDatos();
        pintarTarjeta(tarjeta);
        pintarProgreso();
    });
});
// Botón de reinicio: pide confirmación y borra todo
btnReiniciar.addEventListener("click", function () {
    if (confirm("¿Seguro que quieres borrar todos los datos?")) {
        localStorage.removeItem(CLAVE);
        datos = { nombre: "", ejercicios: {} };
        pintarTodo();
    }
});
// ===== Inicio de la app =====
cargarDatos(); // primero se leen los datos guardados
pintarTodo();  // luego se dibuja la pantalla con esos datos