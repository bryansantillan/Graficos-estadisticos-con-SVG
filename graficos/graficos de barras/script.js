var contadorGraficos = 0;

//Seleccionar el color
var seleccionadorColor1 = document.getElementById("seleccionadorColor1");
var seleccionadorColor2 = document.getElementById("seleccionadorColor2");
var seleccionadorColor3 = document.getElementById("seleccionadorColor3");
//Colores por defecto
var colorSeleccionado1 = "blueviolet";
var colorSeleccionado2 = "darkorange";
var colorSeleccionado3 = "yellow";

seleccionadorColor1.addEventListener("input", function () {
    colorSeleccionado1 = seleccionadorColor1.value;
    console.log("Color 1 seleccionado:", colorSeleccionado1);
});

seleccionadorColor2.addEventListener("input", function () {
    colorSeleccionado2 = seleccionadorColor2.value;
    console.log("Color 2 seleccionado:", colorSeleccionado2);
});

seleccionadorColor3.addEventListener("input", function () {
    colorSeleccionado3 = seleccionadorColor3.value;
    console.log("Color 3 seleccionado:", colorSeleccionado3);
});


//Descargar contenido SVG
const textarea = document.getElementById('textAreaJSON');
const botonDescargar = document.getElementById('botonDescargarJSON');
botonDescargar.addEventListener('click', () => {
    //No poder descargar sin haber generado un gráfico antes
    if (contadorGraficos >= 1) {
        const contenido = textarea.value;
        const nombreArchivo = 'grafico-de-barras.svg';

        //Blob con el contenido de textarea
        const blob = new Blob([contenido], { type: 'image/svg+xml' });
        //Crear enlace para descargar el archivo SVG
        const enlaceDescarga = document.createElement('a');
        enlaceDescarga.href = URL.createObjectURL(blob);
        enlaceDescarga.download = nombreArchivo;

        //Para iniciar la descarga
        enlaceDescarga.click();
        //Limpiar el objeto URL y elimina el enlace temporal
        URL.revokeObjectURL(enlaceDescarga.href);
        enlaceDescarga.remove();
    }
});

function cargarArchivoJSON() {
    //Obtener el archivo JSON
    var entrada = document.getElementById("archivo");
    var file = entrada.files[0];
    //Crear una instancia de FileReader reader para poder leer el contenido del archivo
    var reader = new FileReader();
    //Cuando se completa la lectura del JSON
    reader.readAsText(file);
    reader.onload = function () {
        //Guarda en la variable datos el contenido del archivo
        var datos = JSON.parse(reader.result);
        //Transformación a array
        myArray = Array.from(datos);
        //Limpiar el elemento <svg> 
        d3.select("#graficoJSON").selectAll("*").remove();
        //Llama a la función generarGrafico() pasando myArray como argumento
        generarGrafico(myArray);
    };
};


//Configuración del tamaño y espaciado de las columnas
var configuracion = { anchoBarra: 20, alturaBarra: 235, gapBarra: 5, padding: 100 };

function generarGrafico(datos) {
    contadorGraficos = contadorGraficos + 1;

    var numBarras = datos.length; //Las columnas es la longitud del array de datos
    configuracion.ancho = (configuracion.anchoBarra + configuracion.gapBarra) * numBarras + (2 * configuracion.padding); //Ancho total del gráfico a partir del número de columnas, el ancho de cada una, el espacio entre columnas y el padding a ambos lados
    configuracion.altura = configuracion.alturaBarra + 2 * configuracion.padding;// Calcula la altura total del gráfico a partir del alto de cada columna y el padding (margen) vertical.


    //Se obtiene el valor max con d3.max
    //se le pasa el parametro de entrada (datos) 
    //el segundo parámetro especifica como obtener el valor a ser comparado en cada elemento del array. Con +d se obtiene un numero el cual comparar
    var valorMaximo = d3.max(datos, function (d) { return +d[Object.keys(d)[1]]; });

    //Creación de las escalas
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, configuracion.ancho - 2 * configuracion.padding]) //rango de valores que la escala va a generar
        .domain(datos.map(function (d) { return d[Object.keys(d)[0]]; })); //especifica el dominio de la escala

    var y = d3.scale.linear()
        .range([0, configuracion.alturaBarra])//se define escala lineal hasta alturaBarra
        .domain([0, valorMaximo]);//el valor más alto del dominio se mapeara al valor mas alto del rango
    //asignamos valores a un rangos

    var rangeY = d3.scale.linear()
        .range([configuracion.alturaBarra, 0]) //se define escala lineal desde 0 hasta alturaBarra
        .domain([0, valorMaximo]); //el valor más alto del dominio se mapeara al valor mas alto del rango

    //Creación de los ejes X e Y
    var ejeX = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var ejeY = d3.svg.axis()
        .scale(rangeY)
        .orient("left");

    //Tooltip que muestra información al hacer hover sobre un elemento
    var tooltip = d3.tip()
        .attr('class', 'tooltip')
        .offset([-10, 0]) //posicion del tooltip en relacion al cursor
        .html(function (d) {
            return "<strong>" + d[Object.keys(d)[0]] + "</strong><br> valor: " + +d[Object.keys(d)[1]];
        });

    //Selección del SVG y asignación de ancho y alto
    const svg = d3.select("#graficoJSON")
        .attr("width", configuracion.ancho)
        .attr("height", configuracion.altura);


    // Llamada al tooltip
    svg.call(tooltip);

    // Creación del eje X
    svg.append("g") //crea elemento dentro de svg
        .attr("class", "eje") //Añade la clase eje al elemento g
        .attr("transform", "translate(" + configuracion.padding + "," + (10 + configuracion.padding + configuracion.alturaBarra) + ")") //Establece la posición del elemento g en el plano de coordenadas
        .call(ejeX) //Llamada para crear el eje X
        .selectAll("text") //Selecciona los text creador en el eje X
        .attr("transform", "rotate(90)") //Rota texto para que queden en posición vertical
        .attr("x", "10") //Desplazan texto horizontal
        .attr("y", "-3") //y verticalmente
        .style("font-family", "sans-serif")// Establecer la fuente sans-serif
        .style("text-anchor", "start"); //Alinea texto a la izquierda

    // Creación del eje Y
    svg.append("g")
        .attr("class", "eje")
        .attr("transform", "translate(" + (configuracion.padding - 10) + "," + configuracion.padding + ")")
        .call(ejeY);

    //Creación de las barras
    svg.selectAll("bar")  // selecciona todos los elementos rectángulo en el documento SVG
        .data(datos)  //enlaza los datos de la variable datos con los elementos rectángulo
        .enter().append("rect")  //añade una barra para cada elemento de datos no enlazado
        .attr("width", configuracion.anchoBarra)  //Establece el ancho de la barra
        .attr("x", function (d, i) { return configuracion.padding + x(d[Object.keys(d)[0]]) })  //establece la posición horizontal de la barra
        .attr("y", function (d, i) { return configuracion.padding + configuracion.alturaBarra - y(d[Object.keys(d)[1]]) })  //establece la posición vertical de la barra
        .attr("height", function (d, i) { return y(d[Object.keys(d)[1]]) })  //establece la altura de la barra
        .attr("datos-clave", function (d, i) { return d[Object.keys(d)[0]] })  //establece el atributo 'datos-clave' de la barra
        .attr("datos-valor", function (d, i) { return +d[Object.keys(d)[1]] })  //establece el atributo 'datos-valor' del rectángulo al valor medio formateado de 'd[Object.keys(d)[1]]'
        .attr("fill", colorSeleccionado1)
        .attr("stroke", colorSeleccionado3)
        .attr("stroke-width", 2)
        .on('mouseover', tooltip.show) //para mostrar el tooltip
        .on('mouseout', tooltip.hide);



    //Guardar el estilo del gráfico SVG    
    var css =
        `#graficoJSON rect:hover {
            fill: ${colorSeleccionado2};
            }
            #graficoJSON .eje text {
            font: 10px sans-serif;
            }
            #graficoJSON .eje path,
            #graficoJSON .eje line {
            fill: none;
            stroke: #000;
            shape-rendering: crispEdges;
            }
            #graficoJSON .axis path,
            #graficoJSON .axis line {
            fill: none;
            stroke: #000;
            shape-rendering: crispEdges;
            }`;

    // Añadir estilos al SVG específico
    d3.select("#graficoJSON")
        .append("style")
        .text(css);

    //Mostrar el código SVG calculado
    const element = document.querySelector("#contenedorGraficoSVG");
    const html = element.innerHTML;
    const textarea = document.getElementById('textAreaJSON');
    const botonLimpiar = document.getElementById('botonLimpiarJSON');
    const button = document.querySelector("#botonCopiarJSON");

    document.querySelector("#textAreaJSON").value = html.trim();

    // Copiar código SVG al portapapeles
    button.addEventListener("click", () => {
        textarea.select();
        navigator.clipboard.writeText(textarea.value)
            .then(() => {
                console.log("El código SVG del gráfico de barras desde JSON se ha copiado al portapapeles.");
                // Puedes mostrar un mensaje de éxito u otra acción después de copiar al portapapeles
            })
            .catch((error) => {
                console.error("Error al copiar el código SVG al portapapeles:", error);
                // Puedes mostrar un mensaje de error u otra acción en caso de error
            });
    });
    //Limpiar código SVG del área de texto
    botonLimpiar.addEventListener('click', () => {
        textarea.value = '';
    });

}