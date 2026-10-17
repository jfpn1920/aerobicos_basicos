//-------------------------------------//
//--|funcionalidad_aerobicos_basicos|--//
//-------------------------------------//
const CLAVE = "aerobicosBasicos";
let datos = {
    nombre: "",
    ejercicios: {}
};
const inputNombre = document.getElementById("nombre");
const saludo = document.getElementById("saludo");
const tarjetas = document.querySelectorAll(".tarjeta");
const relleno = document.getElementById("relleno");
const textoProgreso = document.getElementById("textoProgreso");
const btnReiniciar = document.getElementById("btnReiniciar");
//----------------------------//
//--|cargar_datos_guardados|--//
//----------------------------//
function cargarDatos() {
    try {
        const guardado = localStorage.getItem(CLAVE);
        if (guardado) {
            datos = JSON.parse(guardado);
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}
function guardarDatos() {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
}
function obtenerEjercicio(id) {
    if (!datos.ejercicios[id]) {
        datos.ejercicios[id] = {
            minutos: "",
            hecho: false
        };
    }
    return datos.ejercicios[id];
}
//--------------------------------//
//--|mostrar_saludo_del_usuario|--//
//--------------------------------//
function pintarSaludo() {
    inputNombre.value = datos.nombre;
    if (datos.nombre) {
        saludo.textContent = "¡Vamos, " + datos.nombre + "!";
    } else {
        saludo.textContent = "";
    }
}
//-------------------------------------//
//--|actualizar_tarjeta_de_ejercicio|--//
//-------------------------------------//
function pintarTarjeta(tarjeta) {
    const id = tarjeta.dataset.id;
    const ejercicio = obtenerEjercicio(id);
    const campoMinutos = tarjeta.querySelector(".minutos");
    const botonHecho = tarjeta.querySelector(".btn-hecho");
    const estado = tarjeta.querySelector(".estado");
    campoMinutos.value = ejercicio.minutos;
    tarjeta.classList.toggle("hecha", ejercicio.hecho);
    if (ejercicio.hecho) {
        botonHecho.textContent = "Desmarcar";
        estado.textContent = "¡Completado!";
    } else {
        botonHecho.textContent = "Marcar como hecho";
        estado.textContent = "Pendiente";
    }
}
function pintarProgreso() {
    let hechos = 0;
    let totalMinutos = 0;
    tarjetas.forEach(function(tarjeta) {
        const id = tarjeta.dataset.id;
        const ejercicio = obtenerEjercicio(id);
        if (ejercicio.hecho) {
            hechos++;
        }
        totalMinutos += Number(ejercicio.minutos) || 0;
    });
    const porcentaje = (hechos / tarjetas.length) * 100;
    relleno.style.width = porcentaje + "%";
    textoProgreso.textContent = hechos + " de " + tarjetas.length
        + " hechos, " + totalMinutos + " minutos";
}
function pintarTodo() {
    pintarSaludo();
    tarjetas.forEach(function(tarjeta) {
        pintarTarjeta(tarjeta);
    });
    pintarProgreso();
}
//--------------------------------//
//--|guardar_nombre_del_usuario|--//
//--------------------------------//
inputNombre.addEventListener("input", function() {
    datos.nombre = inputNombre.value.trim();
    guardarDatos();
    pintarSaludo();
});
//------------------------------------//
//--|registrar_minutos_de_ejercicio|--//
//------------------------------------//
tarjetas.forEach(function(tarjeta) {
    const id = tarjeta.dataset.id;
    const campoMinutos = tarjeta.querySelector(".minutos");
    const botonHecho = tarjeta.querySelector(".btn-hecho");
    campoMinutos.addEventListener("input", function() {
        const ejercicio = obtenerEjercicio(id);
        ejercicio.minutos = campoMinutos.value;
        guardarDatos();
        pintarProgreso();
    });
    botonHecho.addEventListener("click", function() {
        const ejercicio = obtenerEjercicio(id);
        ejercicio.hecho = !ejercicio.hecho;
        guardarDatos();
        pintarTarjeta(tarjeta);
        pintarProgreso();
    });
});
//-------------------------------//
//--|reiniciar_todos_los_datos|--//
//-------------------------------//
btnReiniciar.addEventListener("click", function() {
    const confirmar = confirm("¿Seguro que quieres borrar todos los datos?");
    if (confirmar) {
        localStorage.removeItem(CLAVE);
        datos = {
            nombre: "",
            ejercicios: {}
        };
        pintarTodo();
    }
});
//---------------------------//
//--|iniciar_la_aplicacion|--//
//---------------------------//
cargarDatos();
pintarTodo();