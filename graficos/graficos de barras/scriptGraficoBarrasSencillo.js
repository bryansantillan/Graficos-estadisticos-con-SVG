graficosSVGgenerados = 0;

const botonGenerar = document.getElementById('botonGenerarSimple');
const numeroEntradas = document.getElementById('numeroEntradas');
const entradasContenedor = document.getElementById('entradas');
const grafico = document.getElementById('graficoBarra');
const chartContainer = document.getElementById('containerGrafico');
const textarea1 = document.getElementById('textAreaSimple');
const botonDescargar1 = document.getElementById('descargarSencillo');
//Descargar SVG
botonDescargar1.addEventListener('click', () => {

  if (graficosSVGgenerados >= 1) {
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
  }
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

  graficosSVGgenerados = graficosSVGgenerados + 1;

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
  //svg {
    //  border: 1px dashed #000000;
  //}
  rect {
      stroke: ${colorSeleccionado3};
      stroke-width: 2;
      fill: ${colorSeleccionado1}  ;
  }
  rect:hover {
      fill:  ${colorSeleccionado2} ;
  }
  .eje text{
      font: 10px sans-serif;
  }
  
  .eje path, .eje line {
      fill: none;
      stroke: #000;
      shape-rendering: crispEdges;
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











