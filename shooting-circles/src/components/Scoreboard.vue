<template>
    <section class="scoreboard-section">
        <div class="container">
            <div class="scoreboard">
                <h2>Scoreboard</h2>
                <ul>
                    <li v-for="(score, index) in topScore" :key="index">
                        {{ score.name }}: {{ score.score.toFixed(2) }}
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';

const gameStore = useGameStore();

const topScore = computed(() => gameStore.getTopScores());
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
    border-radius: 25px;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    box-sizing: border-box;
}

.scoreboard {
    font-size: 1.5rem;
    color: white;
}

h2 {
    font-weight: 800;
    font-size: clamp(1.5rem, 5vw, 3rem);
    text-align: center;
}

ul {
    list-style-type: none;
    padding: 0;
    width: 100%;
}

li {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 5px;
    font-weight: 700;
    font-size: clamp(1rem, 3vw, 2rem);
}
</style>