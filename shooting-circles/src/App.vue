<template>
  <div id="app">
    <div class="container">
      <UserInput v-if="!gameStarted" @start-game="gameState" />
      <Gameboard v-else @end-game="gameState" />
      <Scoreboard class="scoreboard" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UserInput from './components/UserInput.vue';
import Gameboard from './components/Gameboard.vue';
import Scoreboard from './components/Scoreboard.vue';

const gameStarted = ref(false);

// funkcija preko koje togglujemo prikaz
function gameState() {
  gameStarted.value = !gameStarted.value
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}
</style>