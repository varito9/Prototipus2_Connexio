<script setup>

import { ref } from 'vue';
import GameEngine from './components/GameEngine.vue';
import { io } from 'socket.io-client';
import communicationManager from './services/communicationManager.js';

// Estat per controlar quina vista es mostra
const vistaActual = ref('salaEspera'); // 'salaEspera', 'lobby', 'joc'

// Estat per a la connexió
const nomJugador = ref('');
const jugadors = ref([]);
let socket = null;

function connectarAlServidor(){
  communicationManager.connect(nomJugador.value)
  communicationManager.onUpdatePlayerList((llistaDeJugadors) =>{
  jugadors.value = llistaDeJugadors;
  })
  vistaActual.value = 'lobby';
}
</script>

<template>
  <main>
    <!-- VISTA 1: SALA D'ESPERA -->
    <div v-if="vistaActual === 'salaEspera'" class="vista-container">
      <h1>Type Racer Royale</h1>
      <input type="text" v-model="nomJugador" placeholder="Introdueix el teu nom" />
      <button @click="connectarAlServidor">Entra al Lobby</button>
    </div>

    <!-- VISTA 2: LOBBY -->
    <div v-else-if="vistaActual === 'lobby'" class="vista-container">
      <h2>Jugadors Connectats</h2>
      <ul>
        <li v-for="jugador in jugadors" :key="jugador.id" class="jugador">{{ jugador.name }}</li>
      </ul>
      <button @click="vistaActual = 'joc'">Comença a Jugar!</button>
    </div>

    <!-- VISTA 3: JOC -->
    <div v-else-if="vistaActual === 'joc'" class="vista-container">
      <GameEngine />
    </div>
  </main>
</template>