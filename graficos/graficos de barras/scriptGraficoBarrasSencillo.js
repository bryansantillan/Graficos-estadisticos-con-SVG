var graficosSVGgenerados = 0;

const botonGenerar = document.getElementById('botonGenerarSimple');
const numeroEntradas = document.getElementById('numeroEntradas');
const entradasContenedor = document.getElementById('entradas');
const grafico = document.getElementById('graficoBarra');
const chartContainer = document.getElementById('containerGrafico');
const textarea1 = document.getElementById('textAreaSimple');
const botonDescargar1 = document.getElementById('descargarSencillo');
//Descargar SVG
botonDescargar1.addEventListener('click', () => {

  if (graficosSVGgenerados > 0) {
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
//Por defecto, hay 2 entradas
numeroEntradas.value = "2";
generarEntradas();//Se generan los 2 cambios

//Cuando cambie la selección de entradas, se generan
numeroEntradas.addEventListener('change', generarEntradas);


function generarEntradas() {
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
    entryInput.value = "0"; //valor por defecto
    entryInput.setAttribute('placeholder', 'Ingrese número');
    entryInput.addEventListener('input', validarEntradaNumerica);

    texto.appendChild(entryInput);
    entradasContenedor.appendChild(texto);
    entradasContenedor.appendChild(document.createElement('br'));
  }
}

function validarEntradaNumerica(event) {
  const valor = parseInt(event.target.value);
  if (valor < 1 || isNaN(valor)) {
    event.target.value = "1";
    alert("Por favor, introduzca un valor positivo.")
  }
}

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
    const valorEntrada = document.getElementById(`entry-${i}`).value;
    const valorNumerico = valorEntrada !== '' ? parseInt(valorEntrada) : 0;
    entradas.push(valorNumerico);
  }
  // Verificar si hay al menos un valor distinto de cero
  const valoresDistintosDeCero = entradas.filter(valor => valor !== 0);
  if (valoresDistintosDeCero.length === 0) {
    alert('Por favor, introduzca por lo menos un valor numérico positivo para generar un gráfico.');
  }
  else {

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
      barra.setAttribute('fill', colorSeleccionado1);
      barra.setAttribute('stroke', colorSeleccionado3);

      //Añade la barra creada al SVG
      grafico.appendChild(barra);

      //Actualiza el punto de partida en el eje X para la siguiente barra
      x += anchuraBarra + 10;
    });

    var css = `#graficoBarra rect:hover {fill: ${colorSeleccionado2};}`;
    // Añadir estilos al SVG específico
    d3.select("#graficoBarra")
      .append("style")
      .text(css);

    //Mostrar código SVG calculado
    const element = document.querySelector("#containerGrafico");
    const html = element.innerHTML;
    const textarea = document.getElementById('textAreaSimple');
    const botonLimpiar = document.getElementById('botonLimpiar');
    const button = document.querySelector("#botonCopiar");
    // const botonDescargar = document.getElementById('descargar');
    //Mostrar código SVG en textarea
    document.querySelector("#textAreaSimple").value = html.trim();

    // Copiar código SVG al portapapeles
    button.addEventListener("click", () => {
      textarea.select();
      navigator.clipboard.writeText(textarea.value)
        .then(() => {
          console.log("El código SVG del gráfico de barras desde entrada se ha copiado al portapapeles.");
          // Puedes mostrar un mensaje de éxito u otra acción después de copiar al portapapeles
        })
        .catch((error) => {
          console.error("Error al copiar el código SVG al portapapeles:", error);
          // Puedes mostrar un mensaje de error u otra acción en caso de error
        });
    });
    //Limpiar código SVG de textarea
    botonLimpiar.addEventListener('click', () => {
      textarea.value = '';
    });
  }
});

