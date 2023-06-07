var contadorGraficos = 0;

//Obtener datos del formulario
const formulario = document.getElementById('formulario');
const valor1Input = document.getElementById('valor1');
const valor2Input = document.getElementById('valor2');
const valor3Input = document.getElementById('valor3');
const valor4Input = document.getElementById('valor4');
const valor5Input = document.getElementById('valor5');

const valor6Input = document.getElementById('valor6');
const valor7Input = document.getElementById('valor7');
const valor8Input = document.getElementById('valor8');
const valor9Input = document.getElementById('valor9');
const valor10Input = document.getElementById('valor10');


const svg = document.querySelector('svg');
const textarea = document.getElementById('svg-code');
//Descargar SVG
const botonDescargar = document.getElementById('descargar');
botonDescargar.addEventListener('click', () => {
  if (contadorGraficos>=1) {
    const contenido = textarea.value;    
    const nombreArchivo = 'grafico-de-tarta.svg';
  
    //Crea objeto Blob con el contenido de textarea
    const blob = new Blob([contenido], { type: 'image/svg+xml' });
  
    //Crea enlace temporal para descargar el archivo SVG
    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = URL.createObjectURL(blob);
    enlaceDescarga.download = nombreArchivo;
  
    //Para iniciar la descarga
    enlaceDescarga.click();
  
    //Limpia el objeto URL y elimina el enlace temporal
    URL.revokeObjectURL(enlaceDescarga.href);
    enlaceDescarga.remove();
    
  }
});

//Llamada a función con el botón de submit
formulario.addEventListener('submit', generarGrafico);

//Se ejecuta al enviar el formulario
function generarGrafico(event) {
  //Se vacía textarea
  const textarea = document.getElementById('svg-code');
  textarea.value = '';

  svg.innerHTML="";
  event.preventDefault();
  
  //Convertir los valores numéricos del formulario
  const valor1  = parseInt(valor1Input.value);
  const valor2  = parseInt(valor2Input.value);
  const valor3  = parseInt(valor3Input.value);
  const valor4  = parseInt(valor4Input.value);
  const valor5  = parseInt(valor5Input.value);

  const valor6  = parseInt(valor6Input.value);
  const valor7  = parseInt(valor7Input.value);
  const valor8  = parseInt(valor8Input.value);
  const valor9  = parseInt(valor9Input.value);
  const valor10 = parseInt(valor10Input.value);
  //Para comprobar si hay al menos 2 valores rellenos
  const valores = [
  valor1, valor2, valor3, valor4, valor5, valor6, valor7, valor8, valor9, valor10
  ];
  const valoresDistintosDeCero = valores.filter(valor => valor !== 0);

  //Calcular el total de los valores
  const total = valor1 + valor2 + valor3 + valor4 + valor5 + valor6 + valor7 + valor8 + valor9 + valor10;

  //Validar que los valores sean válidos
  if (isNaN(valor1) || isNaN(valor2) || isNaN(valor3) || isNaN(valor4) || isNaN(valor5) ||
      isNaN(valor6) || isNaN(valor7) || isNaN(valor8) || isNaN(valor9) || isNaN(valor10)) {
    alert('Por favor, introduzca valores numéricos válidos.');
  }
  else if (valor1<0 || valor2 <0 || valor3<0 || valor4<0 || valor5<0 || 
           valor6<0 || valor7 <0 || valor8<0 || valor9<0 || valor10<0){ 
    alert('Por favor, introduzca valores numéricos positivos.');
  }
  else if (total == 0){ 
    alert('Por favor, introduzca valores numéricos para generar un gráfico.');
  }
  else if (valoresDistintosDeCero.length < 2){ 
    alert('Por favor, introduzca almenos 2 valores numéricos para generar un gráfico.');
  }
  else {
  //Cuenta los gráficos que se han generado
  contadorGraficos = contadorGraficos+1;

  //Calcular porciones de cada sección
  const seccion1Porcion  = valor1 / total;
  const seccion2Porcion  = valor2 / total;
  const seccion3Porcion  = valor3 / total;
  const seccion4Porcion  = valor4 / total;
  const seccion5Porcion  = valor5 / total;

  const seccion6Porcion  = valor6 / total;
  const seccion7Porcion  = valor7 / total;
  const seccion8Porcion  = valor8 / total;
  const seccion9Porcion  = valor9 / total;
  const seccion10Porcion = valor10/ total;

  //Calcular los ángulos iniciales y finales de cada sección
  const seccion1 = {
    anguloInicial: 0,
    anguloFinal: seccion1Porcion * 360,
  };
  const seccion2 = {
    anguloInicial: seccion1.anguloFinal,
    anguloFinal: seccion1.anguloFinal + seccion2Porcion * 360,
  };
  const seccion3 = {
    anguloInicial: seccion2.anguloFinal,
    anguloFinal: seccion2.anguloFinal + seccion3Porcion * 360,
  };
  const seccion4 = {
    anguloInicial: seccion3.anguloFinal,
    anguloFinal: seccion3.anguloFinal + seccion4Porcion * 360,
  };
  const seccion5 = {
    anguloInicial: seccion4.anguloFinal,
    anguloFinal: seccion4.anguloFinal + seccion5Porcion * 360,
  };

  const seccion6 = {
    anguloInicial: seccion5.anguloFinal,
    anguloFinal: seccion5.anguloFinal + seccion6Porcion * 360,
  };
  const seccion7 = {
    anguloInicial: seccion6.anguloFinal,
    anguloFinal: seccion6.anguloFinal + seccion7Porcion * 360,
  };
  const seccion8 = {
    anguloInicial: seccion7.anguloFinal,
    anguloFinal: seccion7.anguloFinal + seccion8Porcion * 360,
  };
  const seccion9 = {
    anguloInicial: seccion8.anguloFinal,
    anguloFinal: seccion8.anguloFinal + seccion9Porcion * 360,
  };
  const seccion10 = {
    anguloInicial: seccion9.anguloFinal,
    anguloFinal: seccion9.anguloFinal + seccion10Porcion * 360,
  };

  //Calcular las coordenadas del centro del diagrama
  const radio = 300;
  const centroX = 300;
  const centroY = 300;

  //Dibujar las secciones del gráfico de tarta
  //M - Coordenadas de inicio
  //L - Agrega una línea hasta las coordenadas calculadas (desde el punto actual (centro))
    //Se obtienen las coordenadas según el ángulo y el radio. Se pasa a radianes las funciones trigonométricas
  //A - Agrega un comando de arco elíptico, radioX y radioY coinciden con el centro del círculo
  //0 - Aporta información sobre si el arco es mayor o menor de 180
  //1 - Especifica las coordenadas del punto final del arco elíptico
  //Z - Une la figura creando una línea recta desde el punto final del arco hasta el punto de inicio (centro)

  const seccion1Path = `M ${centroX} ${centroY}  
    L ${centroX + radio * Math.cos(seccion1.anguloInicial * Math.PI / 180)} ${centroY + radio * Math.sin(seccion1.anguloInicial * Math.PI / 180)} 
    A ${radio} ${radio} 
    0 ${seccion1.anguloFinal - seccion1.anguloInicial > 180 ? 1 : 0} 
    1 ${centroX + radio * Math.cos(seccion1.anguloFinal * Math.PI / 180)} ${centroY + radio * Math.sin(seccion1.anguloFinal * Math.PI / 180)} Z`;

  //Se crea elemento Path con createElementNS de document. Primer parámetro indica el espacio de nombres XML para SVG y el segundo el tipo
  const seccion1PathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  //Datos que describen la forma
  seccion1PathElement.setAttribute('d', seccion1Path);
  //Se rellena el color
  seccion1PathElement.setAttribute('fill', 'blue');
  //Se añade al espacio SVG
  svg.appendChild(seccion1PathElement);


  const seccion2Path = `M ${centroX} ${centroY} 
    L ${centroX + radio * Math.cos(seccion2.anguloInicial * Math.PI / 180)} ${centroY + radio * Math.sin(seccion2.anguloInicial * Math.PI / 180)} 
    A ${radio} ${radio} 
    0 ${seccion2.anguloFinal - seccion2.anguloInicial > 180 ? 1 : 0} 
    1 ${centroX + radio * Math.cos(seccion2.anguloFinal * Math.PI / 180)} ${centroY + radio * Math.sin(seccion2.anguloFinal * Math.PI / 180)} Z`;

  const seccion2PathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  seccion2PathElement.setAttribute('d', seccion2Path);
  seccion2PathElement.setAttribute('fill', 'green');
  svg.appendChild(seccion2PathElement);


  const seccion3Path = `M ${centroX} ${centroY} 
    L ${centroX + radio * Math.cos(seccion3.anguloInicial * Math.PI / 180)} ${centroY + radio * Math.sin(seccion3.anguloInicial * Math.PI / 180)} 
    A ${radio} ${radio} 
    0 ${seccion3.anguloFinal - seccion3.anguloInicial > 180 ? 1 : 0} 
    1 ${centroX + radio * Math.cos(seccion3.anguloFinal * Math.PI / 180)} ${centroY + radio * Math.sin(seccion3.anguloFinal * Math.PI / 180)} Z`;

  const seccion3PathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    seccion3PathElement.setAttribute('d', seccion3Path);
    seccion3PathElement.setAttribute('fill', 'red');
    svg.appendChild(seccion3PathElement);


  const seccion4Path = `M ${centroX} ${centroY} 
    L ${centroX + radio * Math.cos(seccion4.anguloInicial * Math.PI / 180)} ${centroY + radio * Math.sin(seccion4.anguloInicial * Math.PI / 180)} 
    A ${radio} ${radio} 
    0 ${seccion4.anguloFinal - seccion4.anguloInicial > 180 ? 1 : 0} 
    1 ${centroX + radio * Math.cos(seccion4.anguloFinal * Math.PI / 180)} ${centroY + radio * Math.sin(seccion4.anguloFinal * Math.PI / 180)} Z`;

  const seccion4PathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  seccion4PathElement.setAttribute('d', seccion4Path);
  seccion4PathElement.setAttribute('fill', 'yellow');
  svg.appendChild(seccion4PathElement);


  const seccion5Path = `M ${centroX} ${centroY} 
    L ${centroX + radio * Math.cos(seccion5.anguloInicial * Math.PI / 180)} ${centroY + radio * Math.sin(seccion5.anguloInicial * Math.PI / 180)} 
    A ${radio} ${radio} 
    0 ${seccion5.anguloFinal - seccion5.anguloInicial > 180 ? 1 : 0} 
    1 ${centroX + radio * Math.cos(seccion5.anguloFinal * Math.PI / 180)} ${centroY + radio * Math.sin(seccion5.anguloFinal * Math.PI / 180)} Z`;

  const seccion5PathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  seccion5PathElement.setAttribute('d', seccion5Path);
  seccion5PathElement.setAttribute('fill', 'blueviolet');
  svg.appendChild(seccion5PathElement);




  const seccion6Path = `M ${centroX} ${centroY} 
    L ${centroX + radio * Math.cos(seccion6.anguloInicial * Math.PI / 180)} ${centroY + radio * Math.sin(seccion6.anguloInicial * Math.PI / 180)} 
    A ${radio} ${radio} 
    0 ${seccion6.anguloFinal - seccion6.anguloInicial > 180 ? 1 : 0} 
    1 ${centroX + radio * Math.cos(seccion6.anguloFinal * Math.PI / 180)} ${centroY + radio * Math.sin(seccion6.anguloFinal * Math.PI / 180)} Z`;

  const seccion6PathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  seccion6PathElement.setAttribute('d', seccion6Path);
  seccion6PathElement.setAttribute('fill', 'black');
  svg.appendChild(seccion6PathElement);


  const seccion7Path = `M ${centroX} ${centroY} 
    L ${centroX + radio * Math.cos(seccion7.anguloInicial * Math.PI / 180)} ${centroY + radio * Math.sin(seccion7.anguloInicial * Math.PI / 180)} 
    A ${radio} ${radio} 
    0 ${seccion7.anguloFinal - seccion7.anguloInicial > 180 ? 1 : 0} 
    1 ${centroX + radio * Math.cos(seccion7.anguloFinal * Math.PI / 180)} ${centroY + radio * Math.sin(seccion7.anguloFinal * Math.PI / 180)} Z`;

  const seccion7PathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  seccion7PathElement.setAttribute('d', seccion7Path);
  seccion7PathElement.setAttribute('fill', 'aqua');
  svg.appendChild(seccion7PathElement);


  const seccion8Path = `M ${centroX} ${centroY} 
    L ${centroX + radio * Math.cos(seccion8.anguloInicial * Math.PI / 180)} ${centroY + radio * Math.sin(seccion8.anguloInicial * Math.PI / 180)} 
    A ${radio} ${radio} 
    0 ${seccion8.anguloFinal - seccion8.anguloInicial > 180 ? 1 : 0} 
    1 ${centroX + radio * Math.cos(seccion8.anguloFinal * Math.PI / 180)} ${centroY + radio * Math.sin(seccion8.anguloFinal * Math.PI / 180)} Z`;

  const seccion8PathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  seccion8PathElement.setAttribute('d', seccion8Path);
  seccion8PathElement.setAttribute('fill', 'orange');
  svg.appendChild(seccion8PathElement);


  const seccion9Path = `M ${centroX} ${centroY} 
    L ${centroX + radio * Math.cos(seccion9.anguloInicial * Math.PI / 180)} ${centroY + radio * Math.sin(seccion9.anguloInicial * Math.PI / 180)} 
    A ${radio} ${radio} 
    0 ${seccion9.anguloFinal - seccion9.anguloInicial > 180 ? 1 : 0} 
    1 ${centroX + radio * Math.cos(seccion9.anguloFinal * Math.PI / 180)} ${centroY + radio * Math.sin(seccion9.anguloFinal * Math.PI / 180)} Z`;

  const seccion9PathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  seccion9PathElement.setAttribute('d', seccion9Path);
  seccion9PathElement.setAttribute('fill', 'deeppink');
  svg.appendChild(seccion9PathElement);


  const seccion10Path = `M ${centroX} ${centroY} 
    L ${centroX + radio * Math.cos(seccion10.anguloInicial * Math.PI / 180)} ${centroY + radio * Math.sin(seccion10.anguloInicial * Math.PI / 180)} 
    A ${radio} ${radio} 
    0 ${seccion10.anguloFinal - seccion10.anguloInicial > 180 ? 1 : 0} 
    1 ${centroX + radio * Math.cos(seccion10.anguloFinal * Math.PI / 180)} ${centroY + radio * Math.sin(seccion10.anguloFinal * Math.PI / 180)} Z`;

  const seccion10PathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  seccion10PathElement.setAttribute('d', seccion10Path);
  seccion10PathElement.setAttribute('fill', 'gray');
  svg.appendChild(seccion10PathElement);
  //Fin dibujar las secciones del gráfico de tarta
  

  const element = document.querySelector("#chart-container");
  const html = element.innerHTML;
  const textarea = document.getElementById('svg-code');
  const botonLimpiar = document.getElementById('limpiar');
  const button = document.querySelector("#copy-button");
  
  //Mostrar código SVG en textarea
  document.querySelector("#svg-code").value = html.trim();      
      
  //Copiar código SVG al portapapeles
  button.addEventListener("click", () => {
          textarea.select();
          document.execCommand("copy"); 
  });
  //Limpiar código SVG de textarea
  botonLimpiar.addEventListener('click', () => {
      textarea.value = '';
  });

  }
}


