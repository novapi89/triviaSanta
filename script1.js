
    let selectedItem = null;
    let temaSeleccionado = null;
    let categoriasRestantes = ["habitos", "transmision", "neuro","conservas"];
    let puntajeTotal = 0;
    let intentosPorCategoria = {};
    let jugador = "";
    let preguntas = [];
    let indice = 0;
    let intentosPreguntas = 0;
    let intentosTotales = 0;
    let puntaje = 0;
    let tiempoLimite = 20;
    let timerInterval;
    const maxIntentos = 2;

    const titulo = document.getElementById('tituloTema');
    const preguntaActual = document.getElementById('preguntaActual');
    const timerDisplay = document.getElementById('timer');
    const resultadoFinal = document.getElementById('resultadoFinal');
    const btnResponder = document.getElementById('btnResponder');

    // Seleccionar categoría
    document.querySelectorAll('.bloques').forEach(item => {
        item.addEventListener('click', function () {
            if (selectedItem) {
                selectedItem.classList.remove('selected');
            }
            selectedItem = this;
            selectedItem.classList.add('selected');
        });
    });

    // Iniciar juego con la categoría seleccionada
    document.getElementById('comenzar').addEventListener('click', function () {
        if (selectedItem) {
            temaSeleccionado = selectedItem.getAttribute('data-tema');
            localStorage.setItem('temaSeleccionado', temaSeleccionado);

            if (!jugador) {
                jugador = prompt("Ingrese su nombre:");
                if (!jugador) return;
            }

            document.getElementById('modalTablero').style.display = 'block';
            document.getElementById('tablero').style.display = 'none';
            iniciarCategoria();
        } else {
            // alert('Seleccione un tema');
           mostrarPopup("Seleccione un tema");

        }
    });

    // Array de preguntas por tema (ejemplo, reemplazar con las reales)
    const preguntasPorTema = {
        habitos: [
            { pregunta: "Pregunta 1", opciones: ["Opcion 1", "Opcion 2", "Opcion 3", "Opcion 4"], correcta: "Opcion 1" }
            // { pregunta: "Pregunta 2", opciones: ["Opcion 1", "Opcion 2", "Opcion 3", "Opcion 4"], correcta: "Opcion 3" }
        ],
        transmision: [
            { pregunta: "Pregunta 1", opciones: ["opcion 1", "opcion 2", "opcion 3", "opcion 4"], correcta: "opcion 1" }
        ],
        neuro: [
            { pregunta: "PREGUNTA 1:\n ¿Qué función cumple la mielina en el sistema nervioso?", opciones: ["Dar color a las fibras nerviosas.", "Almacenar energía para el cuerpo.", "Aislar y proteger las fibras nerviosas, permitiendo la transmisión rápida de impulsos eléctricos.", "Producir hormonas que regulan el movimiento."], correcta: "Aislar y proteger las fibras nerviosas, permitiendo la transmisión rápida de impulsos eléctricos." }
            // { pregunta: "PREGUNTA 2:\n ¿Cuál de los siguientes NO es un síntoma común de la esclerosis múltiple?", opciones: ["Problemas de visión.", "Cansancio extremo.", "Hormigueo en manos y pies.", "Dolor de oído."], correcta: "Dolor de oído." },
            // { pregunta: "PREGUNTA 3:\n¿Qué ayuda a mejorar la calidad de vida de una persona con esclerosis múltiple?", opciones: ["Evitar todo tipo de actividad física.", "Los tratamientos médicos, fisioterapia, apoyo psicológico y hábitos saludables.", "No acudir al médico para no estresarse.", "Mantenerse aislado para prevenir contagios."], correcta: "Los tratamientos médicos, fisioterapia, apoyo psicológico y hábitos saludables." },
            //  { pregunta: "PREGUNTA 4:\n¿Qué provoca el daño a la mielina en la esclerosis múltiple?", opciones: ["Que las señales nerviosas se transmitan más rápido.", "Que las señales nerviosas se ralenticen o interrumpan.", "Que los músculos crezcan más rápido.", "Que el sistema inmunitario se fortalezca."], correcta: "Que las señales nerviosas se ralenticen o interrumpan." }
        ],
        conservas: [
            { pregunta: "PREGUNTA 1: ¿Qué microorganismo puede provocar botulismo en las conservas caseras?", opciones: ["Salmonella enteritidis", "Clostridium botulinum", "Escherichia coli", "Staphylococcus aureus"], correcta: "Clostridium botulinum" }
            // { pregunta: "PREGUNTA 2: ¿Qué concentración de azúcar es necesaria para que actúe como conservante natural en una mermelada?", opciones: ["35%", "50%", "65%", "80%"], correcta: "65%" },
            // { pregunta: "PREGUNTA 3: ¿Cuál de los siguientes defectos en una conserva no impide el consumo, pero desmerece la calidad?", opciones: ["Fermentación con tapa hinchada", "Presencia de botulismo", "Desarrollo de mohos", "Color oscuro por exceso de cocción"], correcta: "Color oscuro por exceso de cocción" },
            // { pregunta: "PREGUNTA 4: ¿Qué método casero se utiliza para esterilizar frascos de conserva?", opciones: ["Secado al sol", "Horneado a 160 °C o hervido en agua", "Congelación ", "Solo lavado con detergente"], correcta: "Horneado a 160 °C o hervido en agua" }
        ],
    };

    function iniciarCategoria() {
        puntaje = 0;
        indice = 0;
        intentosTotales = 0;
        preguntas = preguntasPorTema[temaSeleccionado];
        titulo.textContent = "Categoría: " + temaSeleccionado;
        mostrarPregunta();
    }

    function mostrarPregunta(resetAttempts = true) {
        if (resetAttempts) {
            intentosPreguntas = 0; // empieza de 0 solo si es una pregunta nueva
        }
        if (indice >= preguntas.length) {
            finalizarCategoria();
            return;
        }

        const q = preguntas[indice];
        // intentosPreguntas = 0;

        preguntaActual.style.display = 'block';
        preguntaActual.innerHTML = `
            <p><strong>${q.pregunta}</strong></p>
            <div class="bloquePreg">
                ${q.opciones.map(op => `
                    <label class="multipleChoice">
                        <input type="radio" name="respuesta" value="${op}"> ${op}
                    </label><br>
                `).join('')}
            </div>
        `;

        btnResponder.style.display = 'inline-block';
        iniciarTemporizador();
    }

    function iniciarTemporizador() {
        let tiempo = tiempoLimite;
        timerDisplay.textContent = `⏱ Tiempo: ${tiempo} segundos`;

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            tiempo--;
            timerDisplay.textContent = `⏱ Tiempo: ${tiempo} segundos`;
            
            if (tiempo === 0) {
                clearInterval(timerInterval);
                perderIntento();
            }
        }, 1000);
    }

    btnResponder.addEventListener('click', () => {
        clearInterval(timerInterval);

        const seleccionada = document.querySelector('input[name="respuesta"]:checked');
            if (!seleccionada) {
                //alert('Selecciona una opción');
                mostrarPopup("Seleccione una opcion");
                iniciarTemporizador();
                return;
            }

            const respuesta = seleccionada.value;
            const correcta = preguntas[indice].correcta;

            if (respuesta === correcta) {
                let puntos = 0;
                if (intentosPreguntas === 0) {
                    puntos = 10; // primer intento
                } else if (intentosPreguntas === 1) {
                    puntos = 5;  // segundo intento (según pediste: 5)
                }
                puntaje += puntos;
                // avanzamos a la siguiente pregunta y reiniciamos intentos para la siguiente
                indice++;
                mostrarPregunta(true);
            } else {
                // incorrecto: contar intento y decidir
                perderIntento();
            }
    });

function perderIntento() {
    clearInterval(timerInterval); // por si viene por temporizador
    intentosPreguntas++;
    intentosTotales++;

    if (intentosPreguntas < maxIntentos) {
       
        mostrarPopup(`Incorrecto. Te queda ${maxIntentos - intentosPreguntas} intentos(s)` );
        // re-muestra la misma pregunta **sin** resetear intentosPreguntas
        mostrarPregunta(false);
    } else {
        // ya usó los 2 intentos: no suma puntos y pasa a la siguiente pregunta
        mostrarPopup(`😢 Usaste los ${maxIntentos} intentos. No sumas puntos en esta pregunta. Avanzando...`);
        
        indice++; // avanzar a la siguiente pregunta
        mostrarPregunta(true);
    }
}

    function finalizarCategoria() {
        puntajeTotal += puntaje;
        intentosPorCategoria[temaSeleccionado] = intentosTotales;

        // Eliminar categoría jugada
        categoriasRestantes = categoriasRestantes.filter(cat => cat !== temaSeleccionado);

        if (categoriasRestantes.length > 0) {
            volverMenu();
        } else {
            finalizarJuego();
        }
    }

    function volverMenu() {
        document.getElementById('modalTablero').style.display = 'none';
        document.getElementById('tablero').style.display = 'block';

        // Ocultar categorías jugadas
        document.querySelectorAll('.bloques').forEach(bloque => {
            if (!categoriasRestantes.includes(bloque.getAttribute('data-tema'))) {
                bloque.style.display = 'none';
            }
        });
    }

    function finalizarJuego() {
        guardarEnRanking(jugador, puntajeTotal);

        const ranking = obtenerRanking();
        const podio = ranking.slice(0, 3);

        titulo.style.display = 'none';
        timerDisplay.style.display= 'none';
        btnResponder.style.display = 'none';
        preguntaActual.style.display = 'none';
        resultadoFinal.style.display = 'block';
        resultadoFinal.innerHTML = `
            <div class="podio">
                <h3 style="color:green;font-size: 24px">🎉 ¡Felicitaciones ${jugador}!</h3>
                <p style="color:red">Puntaje total: ${puntajeTotal} puntos</p>
                <h4>Intentos por categoría:</h4>
                <ul style="list-style:none">
                    ${Object.entries(intentosPorCategoria).map(([cat, intentos]) => `<li>${cat}: ${intentos} intentos</li>`).join('')}
                </ul>
                <h4>🏆 Podio TOP 3</h4>
                <div class="podio-container" >
                    ${podio.map((p, i) => `
                    <div class="podio-item pos-${i+1}">
                        <span class="nombre">${p.nombre}</span>
                        <span class="puntos">${p.puntos} pts</span>
                    </div>
                        `).join('')}
                </div>
            </div>
            <button onclick="window.location.href='index.html'" class="btn" style="font-size:18px">Menu principal</button>
        `;
    }

    function guardarEnRanking(nombre, puntos) {
        const ranking = JSON.parse(localStorage.getItem('rankingPreguntas')) || [];
        ranking.push({ nombre, puntos });
        ranking.sort((a, b) => b.puntos - a.puntos);
        localStorage.setItem('rankingPreguntas', JSON.stringify(ranking));
    }

    function obtenerRanking() {
        return JSON.parse(localStorage.getItem('rankingPreguntas')) || [];
    }

    function reiniciarLocalStorage(){
        localStorage.clear();
    }
    function mostrarPopup(mensaje) {
        document.getElementById('popup-message').innerText = mensaje;
        document.getElementById('popup').style.display = 'flex';
    }

    function cerrarPopup() {
        document.getElementById('popup').style.display = 'none';
    }


