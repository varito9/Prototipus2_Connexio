// src/services/communicationManager.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080', { autoConnect: false });

// Aquest objecte serà la nostra API per comunicar-nos
const communicationManager = {
  // Funció per connectar-se i enviar el nom
  connect(playerName) {
    socket.connect();
    socket.emit('setPlayerName', playerName);
  },

  // Funcions per ESCOLTAR esdeveniments del servidor
  onUpdatePlayerList(callback) {
    socket.on('updatePlayerList', callback);
  },

  // Funcions per ENVIAR esdeveniments al servidor
 

  // Aquí anirien la resta de funcions per a 'emit' i 'on'
};

export default communicationManager;