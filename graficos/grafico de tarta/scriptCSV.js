var numGraficos = 0;

//Descargar contenido SVG
const textareaCSV = document.getElementById('textAreaCSV');
const botonDescargarCSV = document.getElementById('botonDescargarCSV');
botonDescargarCSV.addEventListener('click', () => {
    //No poder descargar sin haber generado un gráfico antes
    if (numGraficos > 0) {
        const contenido = textareaCSV.value;
        const nombreArchivo = 'grafico-de-tarta.svg';

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

//Adaptar CSV y crear gráfico
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
        .innerRadius(0);
    //Grafico de tarta
    var graficoTarta = d3.pie()
        .sort(null)
        .value(function (d) { return d[Object.keys(d)[1]]; }) //segunda columna (valor)
        .padAngle(0);
    //Creación del SVG
    var svg = d3.select("#graficoDonutCSV")
        .attr("width", anchura)
        .attr("height", altura)
        .append("g")
        .attr("transform", "translate(" + anchura / 2 + "," + altura / 2 + ")");

    //Adaptar CSV
    const datos = d3.csvParse(contenido, type);
    //Unir los elementos arc a los datos del gráfico de tarta con data
    var g = svg.selectAll(".arc")
        .data(graficoTarta(datos))
        .join("g")
        .attr("class", "arc")
        .style("stroke", "lightgray");
    //Se crean según arc y se colorean segun el array colores
    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            //Obtener clave y valor de la primera columna
            var keyColumna1 = Object.keys(d.data)[0];
            var valorColumna1 = d.data[keyColumna1];
            var rangos = valorColumna1.toString().trim();
            return color(rangos);
        });
    //Agregar elemento text al gráfico
    g.append("text")
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function (d) {
            var keyColumna1 = Object.keys(d.data)[0];
            var valorColumna1 = d.data[keyColumna1];
            var rangos = valorColumna1.toString().trim();
            return rangos;
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

    //Copiar código SVG al portapapeles
    button.addEventListener("click", () => {
        textarea.select();
        document.execCommand("copy");
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
