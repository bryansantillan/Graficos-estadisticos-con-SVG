const botonGenerar = document.getElementById('botonGenerarSimple');
const numeroEntradas = document.getElementById('numeroEntradas');
const entradasContenedor = document.getElementById('entradas');
const grafico = document.getElementById('graficoBarra');
const chartContainer = document.getElementById('containerGrafico');
const textarea1 = document.getElementById('textAreaSimple');
const botonDescargar1 = document.getElementById('descargarSencillo');
//Descargar SVG
botonDescargar1.addEventListener('click', () => {
  const contenido = textarea1.value;
  const nombreArchivo = 'grafico-de-barras.svg';

  //Blob con el contenido de textarea
  const blob = new Blob([contenido], { type: 'image/svg+xml' });

  //Crear enlace para descargar el archivo SVG
  const enlaceDescarga = document.createElement('a');
  enlaceDescarga.href = URL.createObjectURL(blob);
  enlaceDescarga.download = nombreArchivo;
  enlaceDescarga.click();

  //Limpiar el objeto URL y elimina el enlace temporal
  URL.revokeObjectURL(enlaceDescarga.href);
  enlaceDescarga.remove();
});


//Agregar las entradas según el desplegable
numeroEntradas.addEventListener('change', () => {
  entradasContenedor.innerHTML = '';
  const numeroEntradasSeleccionadas = parseInt(numeroEntradas.value);

  for (let i = 0; i < numeroEntradasSeleccionadas; i++) {
    //Texto
    const texto = document.createElement('label');
    texto.textContent = `Valor ${i + 1}:`;
    //Entradas
    const entryInput = document.createElement('input');
    entryInput.setAttribute('id', `entry-${i}`);
    entryInput.setAttribute('type', 'number');
    entryInput.addEventListener('input', validarEntradaNumerica);

    texto.appendChild(entryInput);
    entradasContenedor.appendChild(texto);
    entradasContenedor.appendChild(document.createElement('br'));
  }
});

function validarEntradaNumerica(event) {
  const input = event.target;
  const value = input.value;
  //Eliminar caracteres no numéricos
  input.value = value.replace(/[^0-9]/g, '');
}

//Botón que genera el gráfico
botonGenerar.addEventListener('click', () => {
  //Limpia el contenido del SVG previo si lo hubiera
  grafico.innerHTML = '';

  //Obtiene el número de entradas seleccionado por el usuario
  const numeroEntradasSeleccionadas = parseInt(numeroEntradas.value);

  //Recoger las entradas
  const entradas = [];
  for (let i = 0; i < numeroEntradasSeleccionadas; i++) {
    entradas.push(parseInt(document.getElementById(`entry-${i}`).value));
  }

  //Calcular el valor máximo de las entradas y ancho
  const valorMayor = Math.max(...entradas);
  const anchuraBarra = 50;

  //Establecer la posición inicial en el eje X
  let x = 10;

  //Genera una barra para cada entrada
  entradas.forEach((value) => {
    //Calcula la altura de la barra
    const alturaBarra = (value / valorMayor) * grafico.clientHeight;

    // Crea un elemento "rect" en el SVG
    const barra = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    barra.setAttribute('width', anchuraBarra);
    barra.setAttribute('height', alturaBarra);
    barra.setAttribute('x', x);
    barra.setAttribute('y', grafico.clientHeight - alturaBarra);
    barra.setAttribute('fill', 'blue');

    //Añade la barra creada al SVG
    grafico.appendChild(barra);

    //Actualiza el punto de partida en el eje X para la siguiente barra
    x += anchuraBarra + 10;
  });

  //Para darle estilo al gráfico SVG
  var style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.setAttribute('id', 'mi-estilo');
  var css = `
    svg {
        border: 1px dashed #000000;
    }
    rect {
        stroke: blueviolet;
        stroke-width: 2;
        fill: rgb(226, 164, 255)  ;
    }
    rect:hover {
        fill:  rgb(240, 255, 143) ;
    }
    .eje text{
        font: 10px sans-serif;
    }
    
    .eje path, .eje line {
        fill: none;
        stroke: #000;
        shape-rendering: crispEdges;
    }
    
    .tooltip {
        font-family: Arial, helvetica, sans-serif;
        font-size: 10px;
        padding: 8px;
        background: rgba(0, 0, 0, 0.7);
        border: 1px solid #FFFFFF;
        box-shadow: rgba(0, 0, 0, 0.5) 1px 1px 4px;
        color: #FFFFFF;
        border-radius: 4px;
        
    }
    .custom-file-input::-webkit-file-upload-button {
        background-color: blueviolet;
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;grafico
        cursor: pointer;
    }
    
    
    #myFile {
        background-color: rgb(183, 96, 255); /* Color de fondo verde */
        color: white; /* Color del texto en blanco */
        padding: 10px 10px; /* Espacio de relleno para el botón */
        border: none; /* Quita el borde del botón */
        border-radius: 5px; /* Agrega bordes redondeados */
        font-size: 16px; /* Tamaño de fuente */
        
    }
    
    #myFile:hover {
        background-image: linear-gradient(0deg,
        rgba(253, 255, 225, 0.4),
        rgba(253, 255, 225, 0.1));
    }
    
    .custom-file-input::-webkit-file-upload-button:hover,  button:hover { 
        background-color: rgb(255, 255, 153);
        color: blueviolet;
    }`;

  style.innerHTML = css;
  const svg = d3.select("#graficoBarra"); // Selecciona el elemento con el id "graficoBarra" y agrega un elemento SVG
  //Añadir a SVG
  svg.append('style').text(css);

  //Mostrar código SVG calculado
  const element = document.querySelector("#containerGrafico");
  const html = element.innerHTML;
  const textarea = document.getElementById('textAreaSimple');
  const botonLimpiar = document.getElementById('botonLimpiar');
  const button = document.querySelector("#botonCopiar");
  // const botonDescargar = document.getElementById('descargar');
  //Mostrar código SVG en textarea
  document.querySelector("#textAreaSimple").value = html.trim();

  //Copiar código SVG al portapapeles
  button.addEventListener("click", () => {
    textarea.select();
    document.execCommand("copy");
  });
  //Limpiar código SVG de textarea
  botonLimpiar.addEventListener('click', () => {
    textarea.value = '';
  });
});











