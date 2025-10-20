<template>
  <div class="game-engine">
    <div class="paraules-container">
      <!-- Iterem sobre la llista de paraules -->
      <div
        v-for="(paraula, index) in estatDelJoc.paraules"
        :key="paraula.id"
        class="paraula"
        :class="{ 'paraula-activa': index === estatDelJoc.indexParaulaActiva }"
      >
        <div v-if="index === estatDelJoc.indexParaulaActiva">
          <span
            v-for="(lletra, indexLletra) in paraula.text.split('')"
            :key="indexLletra"
            :class="getClaseLetra(indexLletra)"
          >
            {{ lletra }}

          </span>

          <span v-if="paraula.errors > 0" class="error-comptador">
            (Errors: {{ paraula.errors }})
          </span>
        </div>

        <!-- Més endavant mostrarem les lletres aquí -->
        <div v-else>
          {{ paraula.text }}
        </div>
      </div>
    </div>
    <input
      type="text"
      class="text-input"
      v-model="estatDelJoc.textEntrat"
      @input="validarProgres"
      placeholder="Comença a escriure..."
      :disabled="estatDelJoc.jocAcabat"
    />

    <div v-for="(fila, index) in filesDelTeclat" :key="fila" class="fila">
      <button v-for="(letra, index) in fila" :key="letra" class="letra" :class="{teclaPremuda : letra === teclaPremuda }">
        {{ letra }}
      </button>
    </div>

    <div class="contador-tiempo"> Temps: {{ tiempo }}</div>

          <div v-if="estatDelJoc.jocAcabat" class="estadistiques-container">
      <h2> ¡Joc Acabat! </h2>
      <h3>Aquí tens els teus resultats:</h3>
      <table>
        <thead>
          <tr>
            <th>Paraula</th>
            <th>Temps (segons)</th>
            <th>Errors</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="resultat in estatDelJoc.estadistiques" :key="resultat.paraula">
            <td>{{ resultat.paraula }}</td>
            <td>{{ (resultat.temps / 1000).toFixed(2) }}</td>
            <td>{{ resultat.errors }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
const estatDelJoc = ref({
  // Llista de paraules a escriure. Cada paraula és un objecte.
  paraules: [
    { id: 1, text: "component", estat: "pendent", errors: 0 },
    { id: 2, text: "reactivitat", estat: "pendent", errors: 0 },
    { id: 3, text: "javascript", estat: "pendent", errors: 0 },
    { id: 4, text: "framework", estat: "pendent", errors: 0 },
    { id: 5, text: "template", estat: "pendent", errors: 0 },
  ],

  // L'índex de la paraula que l'usuari ha d'escriure ara mateix.
  indexParaulaActiva: 0,
  // El text que l'usuari està introduint a l'input.
  textEntrat: "",

  textEntratAnterior: "",
  // Un array on guardarem els resultats de cada paraula.
  estadistiques: [],
  jocAcabat: false,
});

// Afegeix també una propietat computada per accedir fàcilment a la paraula activa
const paraulaActiva = computed(() => {
  return estatDelJoc.value.paraules[estatDelJoc.value.indexParaulaActiva];
});

let tempsIniciParaula = 0;

function iniciarCronometreParaula() {
  tempsIniciParaula = Date.now();
  iniciarContador();
}

// Funció principal que s'executa a cada pulsació
function validarProgres() {

  if (estatDelJoc.value.jocAcabat || !paraulaActiva.value) return;

  // Iniciem el cronòmetre només quan es comença a escriure la primera lletra
  if (estatDelJoc.value.textEntrat.length === 1 && tempsIniciParaula === 0) {
    iniciarCronometreParaula();
  }

  if (
    estatDelJoc.value.textEntrat.length >
    estatDelJoc.value.textEntratAnterior.length
  ) {
    if (!paraulaActiva.value.text.startsWith(estatDelJoc.value.textEntrat)) {
      paraulaActiva.value.errors++;
    }
  }

  // Al final de la funció, actualitzem el valor anterior per a la pròxima pulsació
  estatDelJoc.value.textEntratAnterior = estatDelJoc.value.textEntrat;

  // Comprovem si la paraula escrita és igual a la paraula activa
  if (estatDelJoc.value.textEntrat === paraulaActiva.value.text) {
    const tempsTrigat = Date.now() - tempsIniciParaula;

    // Desem les estadístiques
    estatDelJoc.value.estadistiques.push({
      paraula: paraulaActiva.value.text,
      temps: tempsTrigat,
      errors: paraulaActiva.value.errors,
    });

    // Marquem la paraula com a completada
    paraulaActiva.value.estat = "completada";

    // Passem a la següent paraula
    estatDelJoc.value.indexParaulaActiva++;

    // Netegem l'input i reiniciem el cronòmetre
    estatDelJoc.value.textEntratAnterior = "";

    estatDelJoc.value.textEntrat = "";
    tempsIniciParaula = 0;

    // Si hi ha una següent paraula

    if (
      estatDelJoc.value.indexParaulaActiva >= estatDelJoc.value.paraules.length
    ) {
      // Joc acabat!
      console.log("Joc acabat!", estatDelJoc.value.estadistiques);
      // NOU: Actualitzem l'estat per mostrar el botó
      estatDelJoc.value.jocAcabat = true;
      pararContador();

    }
    
  }
}
function getClaseLetra(indexLetra) {
  const lletraEsperada = paraulaActiva.value.text[indexLetra];
  const lletraIntroduida = estatDelJoc.value.textEntrat[indexLetra];

  if (!lletraIntroduida) {
    return "";
  } else if (lletraIntroduida === lletraEsperada) {
    return "correcta";
  } else {
    return "incorrecta";
  }
}

// * Función del teclado visual

const filesDelTeclat = ref([
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
]);

const teclaPremuda = ref("");

function handleKeyDown(event) {
  teclaPremuda.value = event.key.toUpperCase();

  setTimeout(() => {
    teclaPremuda.value = "";
  }, 100);
}

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});


//iniciar contador

const contador = ref(0);

const tiempo = computed(() => {
  const minutos = Math.floor(contador.value / 60);
  const segundos = contador.value % 60;

  // Añadir cero delante si es menor de 10
  const min = minutos < 10 ? "0" + minutos : minutos;
  const seg = segundos < 10 ? "0" + segundos : segundos;

  return `${min}:${seg}`;
});

let intervalID = null;


function iniciarContador() {
  if (intervalID) return; // Evitar múltiples intervalos
  intervalID = setInterval(() => {
    contador.value++;
  }, 1000);
}

function pararContador() {
  clearInterval(intervalID);
  intervalID = null;
}

</script>
