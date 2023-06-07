var videoEjemplo, reproducirVideo, barraVideo, progresoVideo, maximoVideo;
var audioEjemplo, reproducirAudio, barraAudio, progresoAudio, maximoAudio;
maximoVideo = 1240; //100% del video
maximoAudio = 1240; //100% del video



function comenzar() {
    // Almacenamos en variables los elementos HTML
    videoEjemplo = document.getElementById("videoEjemplo");
    audioEjemplo = document.getElementById("audioEjemplo")


    reproducirVideo = document.getElementsByClassName("reproducir")[0];
    barraVideo = document.getElementsByClassName("barra")[0];
    progresoVideo = document.getElementsByClassName("progreso")[0];

    reproducirAudio = document.getElementsByClassName("reproducir")[1];
    barraAudio = document.getElementsByClassName("barra")[1];
    progresoAudio = document.getElementsByClassName("progreso")[1];
    //eventos para cuando se pulse un boton...
    reproducirVideo.addEventListener("click", clicando, false);
    barraVideo.addEventListener("click", cambiando, false);

    reproducirAudio.addEventListener("click", clicandoAudio, false);
    barraAudio.addEventListener("click", cambiandoAudio, false);
}

function clicando() {
    if ((videoEjemplo.paused == false) && (videoEjemplo.ended == false)) {
        videoEjemplo.pause();
        reproducirVideo.innerHTML = "▶️";
    }
    else {
        videoEjemplo.play();
        reproducirVideo.innerHTML = "⏸";

        bucle = setInterval(estado, 30);//llama a la funcion estado cada 30ms

    }
}


function estado() {
    if (videoEjemplo.ended == false) {
        // en que punto de la barra en determinado momento de reproducción
        var total = parseInt(videoEjemplo.currentTime * maximoVideo / videoEjemplo.duration);
        var aux = total - 2; //para que no se salga de la barra
        progresoVideo.style.width = aux + "px";

    }
    else {
        reproducirVideo.innerHTML = "⏯️";
    }
}

//cambiar el tiempo de la barra del video
function cambiando(posicion) {
    // if ((videoEjemplo.ended == false)) {
    var ratonX = posicion.pageX - barraVideo.offsetLeft;
    var nuevoTiempo = ratonX * videoEjemplo.duration / maximoVideo;

    videoEjemplo.currentTime = nuevoTiempo;
    var aux = ratonX - 2;//para que no se salga de la barra
    progresoVideo.style.width = ratonX + px;
    // }
}


window.addEventListener("load", comenzar, false);
