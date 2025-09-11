
    let selectedItem = null;
    let temaSeleccionado = null;
    let categoriasRestantes = ["diabetes", "sifilis", "neuro","conservas"];
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
        diabetes: [
            { pregunta: "PREGUNTA 1- ¿Qué es la Diabetes?", opciones: ["Una enfermedad respiratoria crónica", "Una alegría a los dulces", "Una infección en el páncreas", "Una enfermedad donde el cuerpo no regula bien el azúcar en la sangre"], correcta: "Una enfermedad donde el cuerpo no regula bien el azúcar en la sangre" }
            // { pregunta: PREGUNTA 2 - ¿Qué es la insulina?", opciones: ["Un tipo de vitamina", "Una hormona que ayuda a que el azúcar entre la célula", "Solo alimentos sin grasa", "Nada que contenga agua"], correcta: "Una hormona que ayuda a que el azúcar entre la célula" },
            // { pregunta: PREGUNTA 3 - ¿Qué hacer si tienes Diabetes?", opciones: ["Seguir una alimentación saludable hacer ejercicio y controlarse", "Dormir más horas ", "Dejar de comer frutas", "Tomar gaseosa sin azúcar en exceso "], correcta: "Seguir una alimentación saludable hacer ejercicio y controlarse" },
            // { pregunta: PREGUNTA 4 - ¿Qué diferencia hay entre la Diabetes tipo 1 y tipo 2?", opciones: ["La tipo uno es más grave ", "La tipo 1 es autoinmune y la tipo 2 está relacionada con el estilo de vida", "La tipo 2 le da a los niñosa", "No hay diferencia son lo mismo"], correcta: "La tipo 1 es autoinmune y la tipo 2 está relacionada con el estilo de vida" }
        
        ],
         celiaquia: [
            { pregunta: "PREGUNTA 1- ¿Qué es la celiaquía?", opciones: ["Es una enfermedad mental", "Es una enfermedad que afecta en los huesos", "Es una enfermedad gástrica"], correcta: "Es una enfermedad gástrica" }
            // { pregunta: PREGUNTA 2 - ¿Qué significan las letras T.A.C.C?", opciones: ["Trigo, avellanas, chocolate y cereales", "Trigo, avena, cebada y centeno", "Tomate, almendras, cebada y centeno"], correcta: "Trigo, avena, cebada y centeno" },
            // { pregunta: PREGUNTA 3 - Síntomas de la Celiaquía", opciones: ["Dolor de cabeza y resfrío", "Diarrea, nauseas y vomito", "Dolor de muela y dolor muscular"], correcta: "Diarrea, nauseas y vomito" },
            // { pregunta: PREGUNTA 4 - ¿Qué ocurre en el organismo de un celíaco al consumir gluten?", opciones: ["Respuesta alérgica inmediata", "Sistema inmunológico ataca el intestino delgado", "El gluten no se digiere y se elimina sin causar daño", "Aumenta la producción de insulina en el páncreas"], correcta: "Sistema inmunológico ataca el intestino delgado" }
        
        ],
        sifilis: [
            { pregunta: "¿Por qué la sífilis se divide en etapas?", opciones: ["Porque así se pueden describir los síntomas y evolución de la enfermedad.", "Porque cada etapa corresponde a una bacteria distinta.", "Porque depende del médico que la diagnostique."], correcta: "Porque así se pueden describir los síntomas y evolución de la enfermedad." },
            // { pregunta: "¿Cómo se comienza la sífilis secundaria?", opciones: ["Con la aparición de erupciones en la piel y síntomas generales como fiebre", "Con una reacción alérgica a los antibióticos.", "Con síntomas respiratorios graves."], correcta: "Con la aparición de erupciones en la piel y síntomas generales como fiebre." },
            // { pregunta: "¿Es importante hacer el tratamiento de la sífilis?", opciones: ["Sí, porque sin tratamiento puede causar daños graves en órganos vitales y hasta la muerte.", "No, porque desaparece sola con el tiempo.", "Solo si produce síntomas dolorosos."], correcta: "Sí, porque sin tratamiento puede causar daños graves en órganos vitales y hasta la muerte." },

            // { pregunta: "¿Cuál es el mejor tratamiento para la sífilis?", opciones: ["La penicilina indicada por un médico.", "Los remedios caseros sin control médico.", "Automedicarse con antibióticos de venta libre."], correcta: "La penicilina indicada por un médico." }

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
            <div class="bloquePreg option">
                ${q.opciones.map((op, i) => `
                    <input type="radio" id="op${indice}-${i}" name="respuesta" value="${op}">
                    <label for="op${indice}-${i}" class="multipleChoice">${op}</label>
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

    // btnResponder.addEventListener('click', () => {
    //     clearInterval(timerInterval);

    //     const seleccionada = document.querySelector('input[name="respuesta"]:checked');
    //         if (!seleccionada) {
    //             //alert('Selecciona una opción');
    //             mostrarPopup("Seleccione una opcion");
    //             iniciarTemporizador();
    //             return;
    //         }

    //         const respuesta = seleccionada.value;
    //         const correcta = preguntas[indice].correcta;

    //         if (respuesta === correcta) {
    //             let puntos = 0;
    //             if (intentosPreguntas === 0) {
    //                 puntos = 10; // primer intento
    //             } else if (intentosPreguntas === 1) {
    //                 puntos = 5;  // segundo intento (según pediste: 5)
    //             }
    //             puntaje += puntos;
    //             // avanzamos a la siguiente pregunta y reiniciamos intentos para la siguiente
    //             indice++;
    //             mostrarPregunta(true);
    //         } else {
    //             // incorrecto: contar intento y decidir
    //             perderIntento();
    //         }
    // });
    btnResponder.addEventListener('click', () => {
    clearInterval(timerInterval);

    const seleccionada = document.querySelector('input[name="respuesta"]:checked');
    if (!seleccionada) {
        mostrarPopup("Seleccione una opción");
        iniciarTemporizador();
        return;
    }

    // verificar que existe la pregunta actual
    if (!preguntas[indice]) {
        finalizarCategoria();
        return;
    }

    const respuesta = seleccionada.value;
    const correcta = preguntas[indice].correcta;

    if (respuesta === correcta) {
        let puntos = 0;
        if (intentosPreguntas === 0) {
            puntos = 10; // primer intento
        } else if (intentosPreguntas === 1) {
            puntos = 5;  // segundo intento
        }
        puntaje += puntos;

        indice++;
        mostrarPregunta(true); // va a la siguiente
    } else {
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
// document.getElementById("preguntaActual").addEventListener("submit", function(e) {
//   e.preventDefault();

//   // Obtengo todas las opciones
//   const options = document.querySelectorAll("input[name='respuesta']");
//   let selected = false;

//   options.forEach(opt => {
//     const label = opt.nextElementSibling;
//     label.classList.remove("correct", "incorrect"); // limpio estilos previos

//     if (opt.checked) {
//       selected = true;
//       if (opt.dataset.correct === "true") {
//         label.classList.add("correct");
//       } else {
//         label.classList.add("incorrect");
//       }
//     }

//     // mostrar cuál era la correcta
//     if (opt.dataset.correct === "true") {
//       label.classList.add("correct");
//     }
//   });

//   if (!selected) {
//     alert("Por favor selecciona una respuesta antes de continuar.");
//   }
// });
