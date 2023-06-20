var videoEjemplo, reproducirVideo, barraVideo, progresoVideo, maximoVideo, maximizarVideo;
maximoVideo = 1240; //Tamaño en pixeles

function comenzar() {
    // Almacenar en variables los elementos HTML
    videoEjemplo = document.getElementById("videoEjemplo");
    reproducirVideo = document.getElementsByClassName("reproducir")[0];
    barraVideo = document.getElementsByClassName("barra")[0];
    progresoVideo = document.getElementsByClassName("progreso")[0];
    maximizarVideo = document.getElementsByClassName("maximizar")[0];

    // Eventos para cuando se pulsa un botón...
    reproducirVideo.addEventListener("click", clicando, false);
    barraVideo.addEventListener("click", cambiando, false);
    maximizarVideo.addEventListener("click", maximizar, false);
}
function actualizarBarraEnPantallaCompleta(event) {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        cambiando(event); // Actualizar la barra de progreso al entrar en pantalla completa
    }
}

function clicando() {
    if ((videoEjemplo.paused == false) && (videoEjemplo.ended == false)) {
        videoEjemplo.pause();
        reproducirVideo.innerHTML = "▶️";
    } else {
        videoEjemplo.play();
        reproducirVideo.innerHTML = "⏸";
        bucle = setInterval(estado, 50);
    }
}

function estado() {
    if (videoEjemplo.ended == false) {
        var anchoBarra = barraVideo.offsetWidth; //Obtener el ancho de la barra contenedora
        var total = Math.min(parseInt((videoEjemplo.currentTime / videoEjemplo.duration) * anchoBarra), anchoBarra);

        progresoVideo.style.width = total + "px";
    } else {
        reproducirVideo.innerHTML = "🔁"; //Cambiar el valor del botón al final del vídeo
    }
}

function cambiando(event) {
    var ratonX = event.pageX - barraVideo.getBoundingClientRect().left;
    var nuevoTiempo = ratonX * videoEjemplo.duration / barraVideo.offsetWidth;

    if (isFinite(nuevoTiempo)) {
        videoEjemplo.currentTime = nuevoTiempo;
        var porcentajeProgreso = (ratonX / barraVideo.offsetWidth) * 100;
        progresoVideo.style.width = porcentajeProgreso + "%";
    }
}

function maximizar() {
    if (videoEjemplo.requestFullscreen) {
        videoEjemplo.requestFullscreen();
    }
}

window.addEventListener("load", comenzar, false);
