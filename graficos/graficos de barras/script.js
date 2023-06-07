var contadorGraficos = 0;
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


//Dar formato a  D3.js en español a los números (https://gist.github.com/ningunaparte/9d67f051e3f7fedf4e20)
// Se define la localización para España
var nowDate = new Date();

// ES LOCATION
// d3.locale Spanish Spain / Español
// var es_ES = {
//     "decimal": ",",
//     "thousands": ".",
//     "grouping": [3],
//     "currency": ["€", ""],
//     "dateTime": "%a %b %e %X %Y",
//     "date": "%d/%m/%Y",
//     "time": "%H:%M:%S",
//     "periods": ["AM", "PM"],
//     "days": ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
//     "shortDays": ["Dom", "Lun", "Mar", "Mi", "Jue", "Vie", "Sab"],
//     "months": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
//     "shortMonths": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
// };

// var ES = d3.locale(es_ES);

// // PARAMS AVAILABLE https://github.com/mbostock/d3/wiki/Time-Formatting

// var myDefaultFormat = d3.time.format("%A %d, %H:%M");
// var mySampleFormat = ES.timeFormat("%A %d, %H:%M");
// var mySampleNumber = 155624.55;

// var strings = [nowDate, myDefaultFormat(nowDate), mySampleFormat(nowDate), ES.numberFormat(",.")(mySampleNumber)]


//Usando D3, se selcciona <body> del HTML y se agrega una lista desordenada
// d3.select("body").append('ul').selectAll('li')
//     //Seleccionar todos los elementos de la lista
//     .data(strings)
//     //Agrega elementos <li> a la lista
//     .enter().append('li')
//     .text(function (d) {
//         return d;
//     })
//Fin - Dar formato a  D3.js en español a los números (https://gist.github.com/ningunaparte/9d67f051e3f7fedf4e20)


function cargarArchivoJSON() {
    //Obtener el archivo JSON
    var entrada = document.getElementById("archivo");
    var file = entrada.files[0];
    //Crear una instancia de FileReader reader para poder leer el contenido del archivo
    var reader = new FileReader();
    reader.readAsText(file);

    //Cuando se completa la lectura del JSON
    reader.onload = function () {
        //Guarda en la variable datos el contenido del archivo
        var datos = JSON.parse(reader.result);
        //Transformación a array
        myArray = Array.from(datos);

        //Limpiar el elemento <svg> 
        d3.select("svg").selectAll("*").remove();
        //Llama a la función generarGrafico() pasando myArray como argumento
        generarGrafico(myArray);
    };
};



//Configuración del tamaño y espaciado de las columnas
var configuracion = { anchoColumna: 20, columnaAltura: 235, columnGap: 5, padding: 100 };


function generarGrafico(datos) {

    contadorGraficos = contadorGraficos + 1;

    var numColumnas = datos.length; //Las columnas es la longitud del array de datos
    configuracion.ancho = (configuracion.anchoColumna + configuracion.columnGap) * numColumnas + (2 * configuracion.padding); //Ancho total del gráfico a partir del número de columnas, el ancho de cada una, el espacio entre columnas y el padding a ambos lados
    configuracion.altura = configuracion.columnaAltura + 2 * configuracion.padding;// Calcula la altura total del gráfico a partir del alto de cada columna y el padding (margen) vertical.


    //Se obtiene el valor max con d3.max
    //se le pasa el parametro de entrada (datos) 
    //el segundo parámetro especifica como obtener el valor a ser comparado en cada elemento del array. Con +d se obtiene un numero el cual comparar
    var valorMaximo = d3.max(datos, function (d) { return +d[Object.keys(d)[1]]; });

    //Creación de las escalas
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, configuracion.ancho - 2 * configuracion.padding]) //rango de valores que la escala va a generar
        .domain(datos.map(function (d) { return d[Object.keys(d)[0]]; })); //especifica el dominio de la escala

    var y = d3.scale.linear()
        .range([0, configuracion.columnaAltura])//se define escala lineal hasta columnaAltura
        .domain([0, valorMaximo]);//el valor más alto del dominio se mapeara al valor mas alto del rango
    //asignamos valores a un rangos

    var rangeY = d3.scale.linear()
        .range([configuracion.columnaAltura, 0]) //se define escala lineal desde 0 hasta columnaAltura
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
    var svg = d3.select("svg")
        .attr("width", configuracion.ancho)
        .attr("height", configuracion.altura);

    // Llamada al tooltip
    svg.call(tooltip);

    // Creación del eje X
    svg.append("g") //crea elemento dentro de svg
        .attr("class", "eje") //Añade la clase eje al elemento g
        .attr("transform", "translate(" + configuracion.padding + "," + (10 + configuracion.padding + configuracion.columnaAltura) + ")") //Establece la posición del elemento g en el plano de coordenadas
        .call(ejeX) //Llamada para crear el eje X
        .selectAll("text") //Selecciona los text creador en el eje X
        .attr("transform", "rotate(90)") //Rota texto para que queden en posición vertical
        .attr("x", "10") //Desplazan texto horizontal
        .attr("y", "-3") //y verticalmente
        .style("text-anchor", "start"); //Alinea texto a la izquierda

    // Creación del eje Y
    svg.append("g")
        .attr("class", "eje")
        .attr("transform", "translate(" + (configuracion.padding - 10) + "," + configuracion.padding + ")")
        .call(ejeY);

    //Creación de las barras
    svg.selectAll("rect")  // selecciona todos los elementos rectángulo en el documento SVG
        .data(datos)  //enlaza los datos de la variable datos con los elementos rectángulo
        .enter().append("rect")  //añade una barra para cada elemento de datos no enlazado
        .attr("width", configuracion.anchoColumna)  //Establece el ancho de la barra
        .attr("x", function (d, i) { return configuracion.padding + x(d[Object.keys(d)[0]]) })  //establece la posición horizontal de la barra
        .attr("y", function (d, i) { return configuracion.padding + configuracion.columnaAltura - y(d[Object.keys(d)[1]]) })  //establece la posición vertical de la barra
        .attr("height", function (d, i) { return y(d[Object.keys(d)[1]]) })  //establece la altura de la barra
        .attr("datos-clave", function (d, i) { return d[Object.keys(d)[0]] })  //establece el atributo 'datos-clave' de la barra
        .attr("datos-valor", function (d, i) { return +d[Object.keys(d)[1]] })  //establece el atributo 'datos-valor' del rectángulo al valor medio formateado de 'd[Object.keys(d)[1]]'
        .on('mouseover', tooltip.show) //para mostrar el tooltip
        .on('mouseout', tooltip.hide);


    //Guardar el estilo del gráfico SVG    
    var estilo = document.createElementNS("http://www.w3.org/2000/svg", "style");
    estilo.setAttribute('id', 'mi-estilo');
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
                border-radius: 4px;
                cursor: pointer;
            }
            
            
            #archivo {
                background-color: rgb(183, 96, 255); /* Color de fondo verde */
                color: white; /* Color del texto en blanco */
                padding: 10px 10px; /* Espacio de relleno para el botón */
                border: none; /* Quita el borde del botón */
                border-radius: 5px; /* Agrega bordes redondeados */
                font-size: 16px; /* Tamaño de fuente */
                
            }
            
            #archivo:hover {
                background-image: linear-gradient(0deg,
                rgba(253, 255, 225, 0.4),
                rgba(253, 255, 225, 0.1));
            }
            
            .custom-file-input::-webkit-file-upload-button:hover,  button:hover { 
                background-color: rgb(255, 255, 153);
                color: blueviolet;
            }`;
    estilo.innerHTML = css;
    //Añadir al SVG         
    svg.append('style').text(css);

    //Mostrar el código SVG calculado
    const element = document.querySelector("#contenedorGraficoSVG");
    const html = element.innerHTML;
    const textarea = document.getElementById('textAreaJSON');
    const botonLimpiar = document.getElementById('botonLimpiarJSON');
    const button = document.querySelector("#botonCopiarJSON");

    document.querySelector("#textAreaJSON").value = html.trim();

    //Copiar código SVG al portapapeles
    button.addEventListener("click", () => {
        textarea.select();
        document.execCommand("copy");
    });
    //Limpiar código SVG del área de texto
    botonLimpiar.addEventListener('click', () => {
        textarea.value = '';
    });

}

