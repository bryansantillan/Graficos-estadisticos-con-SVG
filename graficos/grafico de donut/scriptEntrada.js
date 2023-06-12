var contadorGraficos = 0;
const textareaEntrada = document.getElementById('svg-code');
//Descargar SVG
const botonDescargarEntrada = document.getElementById('descargar');
botonDescargarEntrada.addEventListener('click', () => {
    if (contadorGraficos >= 1) {
        const contenido = textareaEntrada.value;
        const nombreArchivo = 'grafico-de-donut.svg';

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


function generarGrafico() {
    contadorGraficos = contadorGraficos + 1;
    d3.select("#chart-svg").selectAll("*").remove();
    //Se introduce en el array la información de los campos de entrada
    var data = [];
    data.push(document.getElementById("dataInput1").value);
    data.push(document.getElementById("dataInput2").value);
    data.push(document.getElementById("dataInput3").value);
    data.push(document.getElementById("dataInput4").value);
    data.push(document.getElementById("dataInput5").value);

    data.push(document.getElementById("dataInput6").value);
    data.push(document.getElementById("dataInput7").value);
    data.push(document.getElementById("dataInput8").value);
    data.push(document.getElementById("dataInput9").value);
    data.push(document.getElementById("dataInput10").value);

    var anchura = 400;
    var altura = 600;
    var radio = anchura / 2;

    //Escala de color con 10 colores predefinidos de D3.js
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    //Parámetros del SVG
    var svg = d3.select("#chart-svg")
        .attr("width", anchura)
        .attr("height", altura)
        .append("g")
        .attr("transform", "translate(" + anchura / 2 + "," + (altura / 2 - 100) + ")");
    //Arcos interior y exterior del donut
    var arco = d3.arc()
        .innerRadius(radio - 70)
        .outerRadius(radio - 10);

    //Generador de datos en formato de gráfico de tarta
    var graficoDonut = d3.pie()
        .value(function (d) { return d; });
    //Datos del gráfico
    var datosGrafico = graficoDonut(data);

    //Se añaden los datos del gráfico y se pintan
    svg.selectAll("path")
        .data(datosGrafico)
        .enter().append("path")
        .attr("d", arco)
        .attr("fill", function (d, i) { return color(i); });
    //Circulo interior
    svg.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", radio - 70)
        .attr("fill", "none"); //El relleno en "none" para que sea transparente

    //Array para la leyenda
    var datosLeyenda = [
        { label: "Seccion 1:", value: +document.getElementById("dataInput1").value },
        { label: "Seccion 2:", value: +document.getElementById("dataInput2").value },
        { label: "Seccion 3:", value: +document.getElementById("dataInput3").value },
        { label: "Seccion 4:", value: +document.getElementById("dataInput4").value },
        { label: "Seccion 5:", value: +document.getElementById("dataInput5").value },
        { label: "Seccion 6:", value: +document.getElementById("dataInput6").value },
        { label: "Seccion 7:", value: +document.getElementById("dataInput7").value },
        { label: "Seccion 8:", value: +document.getElementById("dataInput8").value },
        { label: "Seccion 9:", value: +document.getElementById("dataInput9").value },
        { label: "Seccion 10:", value: +document.getElementById("dataInput10").value }
    ];
    //Solo quedarse con las entradas que no tienen valor 0
    datosLeyenda = datosLeyenda.filter(function (d) {
        return d.value !== 0;
    });

    //Calcula la suma total de los valores
    var sumaTotal = d3.sum(datosLeyenda, function (d) { return d.value; });

    //Porcentaje de cada dato
    datosLeyenda.forEach(function (d) {
        d.porcentaje = (d.value / sumaTotal) * 100;
    });

    var g = svg.selectAll(".arc")
        .data(graficoDonut(datosLeyenda))
        .join("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arco)
        .style("fill", function (d) { return color(d.data.label); });

    // Agrega la leyenda
    var legend = svg.selectAll(".legend")
        .data(datosLeyenda.filter(function (d) { return d.value !== 0; }))
        .join("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(20," + (i * 20 + 200) + ")"; });

    //Cuadrado de colores al lado de los textos
    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d) { return color(d.label); });
    //Textos de la leyenda
    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function (d) { return d.label + ": " + d.porcentaje.toFixed(3) + "%"; })
        .style("font", "10px sans-serif")



    const element = document.querySelector("#chart-container");
    const html = element.innerHTML;
    const textarea = document.getElementById('svg-code');
    const botonLimpiar = document.getElementById('limpiar');
    const button = document.querySelector("#botonCopiarEntrada");

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
