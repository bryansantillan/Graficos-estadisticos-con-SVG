// Para saber si el primer valor es fecha o un número entero
var tipo = 0;

// Descargar contenido SVG
var textAreaCSV = document.getElementById('textAreaCSV');
var botonDescargarCSV = document.getElementById('botonDescargarCSV');
botonDescargarCSV.addEventListener('click', function () {
    // No poder descargar sin haber generado un gráfico antes
    if (tipo > 0) {
        var contenido = textAreaCSV.value;
        var nombreArchivo = 'grafico-de-barras.svg';

        // Blob con el contenido de textarea
        var blob = new Blob([contenido], { type: 'image/svg+xml' });
        // Crear enlace para descargar el archivo SVG
        var enlaceDescarga = document.createElement('a');
        enlaceDescarga.href = URL.createObjectURL(blob);
        enlaceDescarga.download = nombreArchivo;

        // Para iniciar la descarga
        enlaceDescarga.click();
        // Limpiar el objeto URL y elimina el enlace temporal
        URL.revokeObjectURL(enlaceDescarga.href);
        enlaceDescarga.remove();
    }
});

function cargarArchivoCSV() {
    var input = document.getElementById('archivoCSV');
    var file = input.files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
        var contenido = e.target.result;
        // Se obtiene el nombre del archivo, para poder luego usarlo como título
        var nombreArchivo = file.name;
        d3.select("#graficoBarras").selectAll("*").remove();
        procesarCSV(contenido, nombreArchivo);
    };
}

// // Crear función de análisis de fechas
// var parseDate = d3.time.format("%d-%m-%Y").parse;

// Procesar el archivo CSV para generar el gráfico de barras
function procesarCSV(contenido, nombreArchivo) {
    // Obtener los valores de las columnas Fecha y Valor
    var datos = d3.csv.parseRows(contenido, function (row, index) {
        if (index === 0) {
            return null; // Ignorar la primera fila, contiene los nombres de las columnas
        }
        var fecha = row[0];
        var valor = parseFloat(row[1]);
        if (isNaN(valor)) {
            return null; //Por seguridad, ignorar filas con valores no numéricos
        }
        if (index === 1 && isNaN(fecha)) {
            tipo = 1; //La primera columna son fechas
        } else if (index === 1) {
            tipo = 2; //La primera columna son numeros
        }
        return { fecha: fecha, valor: valor };
        // console.log(fecha);
        // console.log(valor);
    });

    //    console.log(tipo);

    //Parámetros del gráfico
    const margenes = { arriba: 50, derecha: 50, abajo: 100, izquierda: 50 };
    const anchura = 960 - margenes.izquierda - margenes.derecha;
    const altura = 600 - margenes.arriba - margenes.abajo;
    // Escalas y ejes
    var x = d3.scale.ordinal().rangeRoundBands([0, anchura], 0.05);
    var y = d3.scale.linear().range([altura + 5, 0]);
    var ejeX = d3.svg.axis().scale(x).orient("bottom");
    var ejeY = d3.svg.axis().scale(y).orient("left").ticks(10);

    //Valores de dominio para las escalas
    x.domain(datos.map(function (d) { return d.fecha; }));
    y.domain([0, d3.max(datos, function (d) { return d.valor; })]);
    //Establecer parámetros
    const svg = d3.select("#graficoBarras")
        .attr("width", anchura + margenes.izquierda + margenes.derecha)
        .attr("height", altura + margenes.arriba + margenes.abajo)
        .append("g")
        .attr("transform", "translate(" + margenes.izquierda + "," + margenes.arriba + ")")
        .style("font-family", "sans-serif"); // Establecer la fuente sans-serif;

    //Agregar ejes al gráfico SVG
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (altura + 5) + ")")
        .call(ejeX)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");
    svg.append("g")
        .attr("class", "y axis")
        .call(ejeY)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".75em")
        .style("text-anchor", "end")
        .text("Valor");

    //Barras
    svg.selectAll("bar")
        .data(datos)
        .enter().append("rect")
        .attr("x", function (d) { return x(d.fecha); })
        .attr("width", x.rangeBand())
        .attr("y", function (d) { return y(d.valor); })
        .attr("height", function (d) { return altura - y(d.valor); })
        .attr("fill", colorSeleccionado1)
        .attr("stroke", colorSeleccionado3);

    // Agregar título al gráfico
    svg.append("text")
        .attr("x", (anchura / 2))
        .attr("y", 0 - (margenes.arriba / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(nombreArchivo);

    //Aregar css
    var css = `#graficoBarras rect:hover {
    fill: ${colorSeleccionado2};
}
#graficoBarras .eje path,
#graficoBarras .eje line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
}
#graficoBarras .axis path,
#graficoBarras .axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
}`;

    // Añadir estilos al SVG específico
    d3.select("#graficoBarras")
        .append("style")
        .text(css);

    //Mostrar el código SVG calculado
    const element = document.querySelector("#contenedorGrafico");
    const html = element.innerHTML;
    const textarea = document.getElementById('textAreaCSV');
    const botonLimpiar = document.getElementById('botonLimpiarCSV');
    const button = document.querySelector("#botonCopiarCSV");

    document.querySelector("#textAreaCSV").value = html.trim();

    // Copiar código SVG al portapapeles
    button.addEventListener("click", () => {
        textarea.select();
        navigator.clipboard.writeText(textarea.value)
            .then(() => {
                console.log("El código SVG del gráfico de barras desde CSV se ha copiado al portapapeles.");
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