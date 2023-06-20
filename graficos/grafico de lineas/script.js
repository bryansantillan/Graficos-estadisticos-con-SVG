//Para saber si el primer valor es fecha o un número entero
let tipo = 0;

//Seleccionar el color
const seleccionadorColorCSV1 = document.getElementById("seleccionadorColorCSV1");
const seleccionadorColorCSV2 = document.getElementById("seleccionadorColorCSV2");
const seleccionadorColorCSV3 = document.getElementById("seleccionadorColorCSV3");

//Colores predeterminados
let colorSeleccionado1 = "#8B0000"; //darkred
let colorSeleccionado2 = "#8A2BE2"; //blueviolet
let colorSeleccionado3 = "#3b3b3b";  //gris oscuro

seleccionadorColorCSV1.addEventListener("input", function () {
    colorSeleccionado1 = seleccionadorColorCSV1.value;
    console.log("Color 1 seleccionado:", colorSeleccionado1);
});

seleccionadorColorCSV2.addEventListener("input", function () {
    colorSeleccionado2 = seleccionadorColorCSV2.value;
    console.log("Color 2 seleccionado:", colorSeleccionado2);
});

seleccionadorColorCSV3.addEventListener("input", function () {
    colorSeleccionado3 = seleccionadorColorCSV3.value;
    console.log("Color 3 seleccionado:", colorSeleccionado3);
});



//Descargar contenido SVG
const textarea = document.getElementById('textAreaCSV');
const botonDescargar = document.getElementById('botonDescargarCSV');
botonDescargar.addEventListener('click', () => {
    //No poder descargar sin haber generado un gráfico antes
    if (tipo > 0) {
        const contenido = textarea.value;
        const nombreArchivo = 'grafico-de-lineas.svg';

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
        //Se obtiene el nombre del archivo, para poder luego usarlo como título
        const nombreArchivo = file.name;
        procesarCSV(contenido, nombreArchivo);
    };
    reader.readAsText(file);
}
//Formato para las fechas
const parseDate = d3.timeParse("%d-%m-%Y");

//Procesar el archivo CSV y crear el gráfico de líneas
function procesarCSV(contenido, nombreArchivo) {
    //Obtener los valores de las primeras 2 columnas, independientemente del nombre de las columnas
    const datos = d3.csvParse(contenido, function (d) {
        const columnas = Object.keys(d);
        //Detectar si los valores de la primera columna son fecha o son enteros
        const posibleFecha = parseDate(d[columnas[0]]);
        if (posibleFecha instanceof Date && !isNaN(posibleFecha)) {
            d.fecha = posibleFecha;
            tipo = 1;
        } else {
            d.fecha = +d[columnas[0]];
            tipo = 2;
        }
        d.valor = +d[columnas[1]];
        return d;
    });

    const columnas = Object.keys(datos[0]);

    //Se ordenan los valores, según el tipo de la primera columna
    if (tipo == 1) {
        datos.sort((a, b) => a.fecha - b.fecha);
    } else if (tipo == 2) {
        datos.sort((a, b) => a[columnas[0]] - b[columnas[0]]);
    }

    //Mostrar CSV para comprobar que se ha cargado correctamente
    // console.log(datos);

    //Limpiar el elemento <svg> previo
    d3.select("svg").selectAll("*").remove();

    //Establecer dimensiones del gráfico de línea
    const margen = { arriba: 70, derecha: 30, abajo: 90, izquierda: 80 };
    const anchura = 1200 - margen.izquierda - margen.derecha;
    const altura = 500 - margen.arriba - margen.abajo;

    //Escalas
    const x = d3.scaleTime()
        .range([0, anchura]);
    const y = d3.scaleLinear()
        .range([altura, 0]);

    //Se crea lo que será la línea principal
    const lineaPrincipal = d3.line()
        .x(d => x(d.fecha))
        .y(d => y(d.valor));

    //Establecer las dimensiones del gráfico
    const svg = d3.select("#graficoLinea")
        .attr("width", anchura + margen.izquierda + margen.derecha)
        .attr("height", altura + margen.arriba + margen.abajo)
        .append("g") //grupo
        .attr("transform", `translate(${margen.izquierda},${margen.arriba})`);

    //Tootip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip");

    //Establecer los dominios
    x.domain(d3.extent(datos, d => d.fecha));
    y.domain([0, d3.max(datos, d => d.valor)]);

    //Eje X
    if (tipo == 1) {
        svg.append("g")
            .attr("transform", `translate(0,${altura})`)
            .style("font-size", "10px")
            .call(d3.axisBottom(x)
                .tickValues(x.ticks(d3.timeDay.every(2))) //Cada 2 días en el eje
                .tickFormat(d3.timeFormat("%d %m %Y"))) //Formato a dia mes y anno
            // .call(g => g.select(".domain").remove()) //Para quitar el eje X
            .selectAll(".tick line")
            .style("stroke-opacity", 5)
        svg.selectAll(".tick text")//Ajuste de los ticktext
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start")
            .style("alignment-baseline", "middle")
            .attr("x", 10)
            .attr("y", -10);
    } else if (tipo == 2) {
        svg.append("g")
            .attr("transform", `translate(0,${altura})`)
            .style("font-size", "12px")
            .call(d3.axisBottom(x)
                .tickFormat(d3.format("d"))) //Cada valor
            .selectAll(".tick line")
            .style("stroke-opacity", 5)
        svg.selectAll(".tick text")
            // .attr("transform", "rotate(90)")
            .style("text-anchor", "start")
            .style("alignment-baseline", "middle")
            .attr("x", 5)
    }
    //Lineas verticales
    svg.selectAll("xGrid")
        .data(x.ticks().slice(1))
        .join("line")
        .attr("x1", d => x(d))
        .attr("x2", d => x(d))
        .attr("y1", 0)
        .attr("y2", altura)
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", 1);

    //Eje Y
    const ejeY = svg.append("g")
        .style("font-size", "10px")
        .call(d3.axisLeft(y)
            .tickFormat(d3.format("d")));

    if (datos.length > 30) { //Mas de 30, no se muestra para no enborronar el gráfico
        ejeY.selectAll(".tick text")
            .style("display", "none")
    }
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margen.izquierda)
        .attr("x", 0 - (altura / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-family", "sans-serif")
        .text("Valores");

    //Lineas horizontales
    svg.selectAll("yGrid")
        .data(y.ticks(5))
        .join("line")
        .attr("x1", 0)
        .attr("x2", anchura)
        .attr("y1", d => y(d))
        .attr("y2", d => y(d))
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", 1)

    //Pintar línea principal
    const path = svg.append("path")
        .datum(datos)
        .attr("fill", "none")
        .attr("stroke", colorSeleccionado1)
        .attr("stroke-width", 1)
        .attr("d", lineaPrincipal);

    //Pintar los círculos de los datos
    const circulo = svg.append("circle")
        .attr("r", 0)
        .attr("fill", colorSeleccionado2)
        .style("stroke", "white")
        .attr("opacity", .70)
        .style("pointer-events", "none");

    const areaAux = svg.append("rect")
        .attr("width", anchura)
        .attr("height", altura);
    //Cuando se ponga encima el ratón del área auxiliar
    areaAux.on("mousemove", function (event) {
        //Obtener la coordenada X del evento
        const [xCoord] = d3.pointer(event, this);
        //Indice del dato
        const indiceDato = d3.bisector(d => d.fecha).left;
        //obtener X en la escala inversa
        const x0 = x.invert(xCoord);
        //obtener el valor más cercano
        const i = indiceDato(datos, x0, 1);
        const d0 = datos[i - 1];
        const d1 = datos[i];
        //Si no es el último dato
        if (i < datos.length) {
            //Valor del dato en d
            const d = x0 - d0.fecha > d1.fecha - x0 ? d1 : d0;
            const xPos = x(d.fecha);
            const yPos = y(d.valor);

            // Actualizar la posición del círculo al dato
            circulo.attr("cx", xPos)
                .attr("cy", yPos);

            //Transición del círculo
            circulo.transition()
                .duration(70)
                .attr("r", 10);

            //Pintar el tooltip
            tooltip
                .style("display", "block")
                .style("left", `${xPos + 20}px`) //Posición del dato X
                .style("bottom", `${+600}px`) //Posición absoluta en 600
                .html(d.fecha instanceof Date ?//Dependiendo si es una fecha o un entero
                    `<strong>Fecha:</strong> ${d.fecha.toLocaleDateString()}<br><strong>Valor:</strong> ${d.valor !== undefined ? (d.valor).toFixed(0) : 'N/A'}` :
                    `<strong>Fila:</strong> ${d.fecha}<br><strong>Valor:</strong> ${d.valor !== undefined ? (d.valor).toFixed(0) : 'N/A'}`);
        }
    });

    //Cuando se sale del área del gráfico
    areaAux.on("mouseleave", function () {
        circulo.transition()
            .duration(100)
            .attr("r", 5);
        //No se muestra el tootip
        tooltip.style("display", "none");
    });

    //Título del gráfico
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", margen.izquierda - 115)
        .attr("y", margen.arriba - 100)
        .style("font-size", "24px")
        .style("font-family", "sans-serif")
        .text(nombreArchivo);


    //Guardar el estilo del gráfico SVG    
    var estilo = document.createElementNS("http://www.w3.org/2000/svg", "style");
    estilo.setAttribute('id', 'mi-estilo');
    var css = `
        rect {
            pointer-events: all;
            fill-opacity: 0;
            stroke-opacity: 0;
            z-index: 1;
            fill: ${colorSeleccionado1}  ;
        }
        .tooltip {
            position: absolute;
            scale: 70%;
            padding: 10px;
            background-color:${colorSeleccionado3} ;
            color: white;
            border: 1px solid white;
            border-radius: 10px;
            display: none;
            opacity: .75;
        }`;
    estilo.innerHTML = css;
    //Añadir al SVG el estilo
    svg.append('style').text(css);

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
                console.log("El código SVG del gráfico de líneas desde CSV se ha copiado al portapapeles.");
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