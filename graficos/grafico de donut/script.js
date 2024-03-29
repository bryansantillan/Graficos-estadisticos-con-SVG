var numGraficos = 0;
//Descargar contenido SVG
const textarea = document.getElementById('textAreaCSV');
const botonDescargar = document.getElementById('botonDescargarCSV');
botonDescargar.addEventListener('click', () => {
    //No poder descargar sin haber generado un gráfico antes
    if (numGraficos > 0) {
        const contenido = textarea.value;
        const nombreArchivo = 'grafico-de-donut.svg';

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

function cargarArchivoCSV() {
    const input = document.getElementById('archivoCSV');
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const contenido = e.target.result;
        const nombreArchivo = file.name;
        procesarCSV(contenido, nombreArchivo);
    };
    reader.readAsText(file);
}

function procesarCSV(contenido, nombreArchivo) {

    numGraficos = numGraficos + 1;

    var anchura = 960,
        altura = 500,
        radio = Math.min(anchura, altura) / 2;

    //Colores, si hay más de 10 datos, se rotan desde el principo
    var color = d3.scaleOrdinal()
        .range(['blue', 'green', 'red', 'yellow', 'blueviolet', 'black', 'aqua', 'darkorange', 'deeppink', 'gray']);

    //arco
    var arc = d3.arc()
        .outerRadius(radio - 10)
        .innerRadius(radio - 70);
    //Grafico de donut
    var graficoDonut = d3.pie()
        .sort(null)
        .value(function (d) { return d[Object.keys(d)[1]]; }); //segunda columna (valor)

    //Creación del SVG
    var svg = d3.select("#graficoDonutCSV")
        .attr("width", anchura)
        .attr("height", altura)
        .append("g")
        .attr("transform", "translate(" + anchura / 2 + "," + altura / 2 + ")");

    //Adaptar datos CSV
    const datos = d3.csvParse(contenido, type);

    //Enlazar información de los arc con los datos
    var g = svg.selectAll(".arc")
        .data(graficoDonut(datos))
        .join("g")
        .attr("class", "arc")
        .style("stroke", "lightgray");
    //Se crean según arc y se colorean segun el array colores
    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            var firstColumnKey = Object.keys(d.data)[0];
            var firstColumnValue = d.data[firstColumnKey];
            var ageRange = firstColumnValue.toString().trim();
            return color(ageRange);
        });
    //Agregar elemento text al gráfico
    g.append("text")
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function (d) {
            var firstColumnKey = Object.keys(d.data)[0];
            var firstColumnValue = d.data[firstColumnKey];
            var ageRange = firstColumnValue.toString().trim();
            return ageRange;
        })
        .style("stroke", "black")
        .style("text-shadow", "0.25px 0.25px 0.25px white, -0.25px -0.25px 0.25px white, 0.25px -0.25px 0.25px white, -0.25px 0.25px 0.25px white")
        .style("font", "10px sans-serif")
        .style("text-anchor", "middle");

    //Mostrar el código SVG calculado
    const element = document.querySelector("#contenedorGraficoSVG");
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
                console.log("El código SVG del gráfico de donut desde CSV se ha copiado al portapapeles.");
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

};
//Forzar pasar a entero, si fuera necesario
function type(d) {
    d[Object.keys(d)[1]] = +d[Object.keys(d)[1]];
    return d;
}
