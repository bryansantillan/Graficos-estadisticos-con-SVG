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

const valor11Input = document.getElementById('valor11');
const valor12Input = document.getElementById('valor12');
const valor13Input = document.getElementById('valor13');
const valor14Input = document.getElementById('valor14');
const valor15Input = document.getElementById('valor15');

const areatext = document.getElementById('svg-code');
//Descargar SVG
const botonDescarga = document.getElementById('descargar');
botonDescarga.addEventListener('click', () => {
    if (contadorGraficos >= 1) {
        const contenido = areatext.value;
        const nombreArchivo = 'grafico-de-lineasEntrada.svg';

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
    const areatext = document.getElementById('svg-code');
    areatext.value = '';

    d3.select("#svg-chart").selectAll("*").remove();

    event.preventDefault();

    //Convertir los valores numéricos del formulario
    const valor1 = parseInt(valor1Input.value);
    const valor2 = parseInt(valor2Input.value);
    const valor3 = parseInt(valor3Input.value);
    const valor4 = parseInt(valor4Input.value);
    const valor5 = parseInt(valor5Input.value);

    const valor6 = parseInt(valor6Input.value);
    const valor7 = parseInt(valor7Input.value);
    const valor8 = parseInt(valor8Input.value);
    const valor9 = parseInt(valor9Input.value);
    const valor10 = parseInt(valor10Input.value);

    const valor11 = parseInt(valor11Input.value);
    const valor12 = parseInt(valor12Input.value);
    const valor13 = parseInt(valor13Input.value);
    const valor14 = parseInt(valor14Input.value);
    const valor15 = parseInt(valor15Input.value);

    //Para comprobar si hay al menos 2 valores rellenos
    let valores = [
        valor1, valor2, valor3, valor4, valor5, valor6, valor7, valor8, valor9, valor10,
        valor11, valor12, valor13, valor14, valor15
    ];

    const valoresDistintosDeCero = valores.filter(valor => valor !== 0);

    //Calcular el total de los valores
    const total = valor1 + valor2 + valor3 + valor4 + valor5 + valor6 + valor7 + valor8 + valor9 + valor10 +
        valor11 + valor12 + valor13 + valor14 + valor15;

    //Validar que los valores sean válidos
    if (isNaN(valor1) || isNaN(valor2) || isNaN(valor3) || isNaN(valor4) || isNaN(valor5) ||
        isNaN(valor6) || isNaN(valor7) || isNaN(valor8) || isNaN(valor9) || isNaN(valor10) ||
        isNaN(valor11) || isNaN(valor12) || isNaN(valor13) || isNaN(valor14) || isNaN(valor15)) {
        alert('Por favor, introduzca valores numéricos válidos.');
    }
    else if (valor1 < 0 || valor2 < 0 || valor3 < 0 || valor4 < 0 || valor5 < 0 ||
        valor6 < 0 || valor7 < 0 || valor8 < 0 || valor9 < 0 || valor10 < 0 ||
        valor11 < 0 || valor12 < 0 || valor13 < 0 || valor14 < 0 || valor15 < 0) {
        alert('Por favor, introduzca valores numéricos positivos.');
    }
    else if (total == 0) {
        alert('Por favor, introduzca valores numéricos para generar un gráfico.');
    }
    else if (valoresDistintosDeCero.length < 2) {
        alert('Por favor, introduzca almenos 2 valores numéricos para generar un gráfico.');
    }
    else {
        //Cuenta los gráficos que se han generado
        contadorGraficos = contadorGraficos + 1;

        const arrayX = [];
        for (let i = 1; i <= valoresDistintosDeCero.length; i++) {
            arrayX.push(i);
        }
        //Se quitan los valores que sean 0 de valor
        valores = valores.filter(valor => valor !== 0);
        //Se unen ambos array en datos
        const datos = arrayX.map((x, i) => ({ x: x, y: valores[i] }));

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
            .x(d => x(d.x))
            .y(d => y(d.y));

        //Establecer las dimensiones del gráfico
        const svg = d3.select("#svg-chart")
            .attr("width", anchura + margen.izquierda + margen.derecha)
            .attr("height", altura + margen.arriba + margen.abajo)
            .append("g") //grupo
            .attr("transform", `translate(${margen.izquierda},${margen.arriba})`);

        //Tootip
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip");

        //Establecer los dominios
        x.domain(d3.extent(arrayX));
        y.domain([0, d3.max(valores)]);

        //Eje X
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

        //Eje y
        // Calcular el rango completo de valores
        var minY = d3.min(datos, d => d.y);
        var maxY = d3.max(datos, d => d.y);

        //Si el maximo es pequeño, pintar todos los valores
        if (maxY < 20) {
            var valorTicks = d3.range(minY, maxY + 1);
        } else {
            //Pintar solo los valores de Y para no enborronar el eje
            var valoresY = Array.from(new Set(datos.map(d => d.y)));
            // Configurar los valores de los ticks del eje Y
            var valorTicks = valoresY.length > 5 ? valoresY.slice(0, 5) : valoresY;
        }

        //Agregar inforamción al eje Y
        svg.append("g")
            .style("font-size", "10px")
            .call(d3.axisLeft(y)
                .tickValues(valorTicks)
                .tickFormat(d3.format("d")));
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
        //Area auxiliar
        const areaAux = svg.append("rect")
            .attr("width", anchura + 20)
            .attr("height", altura + 20);
        //Cuando se ponga encima el ratón del área auxiliar
        areaAux.on("mousemove", function (event) {
            //Obtener la coordenada X del evento
            const [xCoord] = d3.pointer(event, this);
            //Indice del dato
            const indiceDato = d3.bisector(d => d.x).left;
            //obtener X en la escala inversa
            const x0 = x.invert(xCoord);
            //obtener el y más cercano
            const i = indiceDato(datos, x0, 1);
            const d0 = datos[i - 1];
            const d1 = datos[i];
            //Si no es el último dato
            if (i < datos.length) {
                //y del dato en d
                const d = x0 - d0.x > d1.x - x0 ? d1 : d0;
                const xPos = x(d.x);
                const yPos = y(d.y);

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
                    .style("bottom", `${yPos - 1200}px`)
                    .html(`<strong>x:</strong> ${d.x}<br><strong>y:</strong> ${d.y !== undefined ? (d.y).toFixed(0) : 'N/A'}`);
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

        const element = document.querySelector("#chart-container");
        const html = element.innerHTML;
        const areatext = document.getElementById('svg-code');
        const botonLimpiar = document.getElementById('limpiar');
        const button = document.querySelector("#copy-button");

        //Mostrar código SVG en textarea
        document.querySelector("#svg-code").value = html.trim();

        // Copiar código SVG al portapapeles
        button.addEventListener("click", () => {
            areatext.select();
            navigator.clipboard.writeText(areatext.value)
                .then(() => {
                    console.log("El código SVG del gráfico de líneas desde entrada se ha copiado al portapapeles.");
                    // Puedes mostrar un mensaje de éxito u otra acción después de copiar al portapapeles
                })
                .catch((error) => {
                    console.error("Error al copiar el código SVG al portapapeles:", error);
                    // Puedes mostrar un mensaje de error u otra acción en caso de error
                });
        });
        //Limpiar código SVG de textarea
        botonLimpiar.addEventListener('click', () => {
            areatext.value = '';
        });
    }
}