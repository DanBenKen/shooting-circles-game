<template>
        <div class="container">
            <div class="game-board">
                <div v-for="(circle, index) in circles" id="circle" :key="index" :style="getCircleStyle(circle)" @click="handleCircleClick(index)">
                </div>
                <div v-if="isPaused" class="paused-overlay">
                    <div v-if="gameConditionMessage" class="game-condition-message">
                        {{ gameConditionMessage }}
                    </div>
                    <button class="button" role="button" @click="resumeGame">GO AGAIN</button>
                </div>
            </div>
        </div>
        <div class="btn-container">
            <button class="button btn-gameboard" role="button" @click="endGame">End Game</button>
            <button class="button btn-gameboard" role="button" @click="resetGame">Reset Game</button>
        </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useGameStore } from '@/stores/gameStore';

const emit = defineEmits(['end-game']);

const gameStore = useGameStore();
let startTime = Date.now();
const circles = ref([]);
const gameConditionMessage = ref('');
const isPaused = ref(false);

// funkcija za generisanje krugova
function generateCircles() {
    // funkcija za generisanje krugova u boji
    function generateColoredCircles(count, colors) {
        const coloredCircles = [];

        for (let i = 0; i < count; i++) {
            const { maxX, maxY, size } = calculateCircleDimensions();

            coloredCircles.push({
                x: `${Math.random() * maxX}%`,
                y: `${Math.random() * maxY}%`,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: `${size}px`,
                isBlack: false,
            });
        }

        return coloredCircles;
    }
    
    // funkcija za generisanje crnih krugova
    function generateBlackCircles(count) {
        const blackCircles = [];
        
        const { maxX, maxY, size } = calculateCircleDimensions();
        
        for (let i = 0; i < count; i++) {
            blackCircles.push({
                x: `${Math.random() * maxX}%`,
                y: `${Math.random() * maxY}%`,
                color: `black`,
                size: `${size}px`,
                isBlack: true,
            });
        }

        return blackCircles;
    }

    // funkcija za racunanje dimenzija krugova
    function calculateCircleDimensions() {
        const size = Math.random() * 50 + 20;
        const maxX = 100 - size / 2;
        const maxY = 100 - size / 2;

        return { maxX, maxY, size };
    }
    
    circles.value = [];
    const totalCircles = gameStore.circleCount;
    const blackCircleCount = 2;

    circles.value.push(...generateBlackCircles(blackCircleCount));
    circles.value.push(...generateColoredCircles(totalCircles, gameStore.circleColors));

    startTime = Date.now();
}

// funkcija za generisanje stila 
function getCircleStyle(circle) {
    return {
        backgroundColor: circle.color,
        width: circle.size,
        height: circle.size,
        top: circle.y,
        left: circle.x,
        position: `absolute`,
        borderRadius: `50%`,
    };
}

// funkcija za rukovanje click-a na krugovima
function handleCircleClick(index) {
    if (isPaused.value) {
        return;
    }

    const circle = circles.value[index];

    if (circle.isBlack) {
        gameConditionMessage.value = `You clicked BLACK cricle!`
        pauseGame();
    } else {
        circles.value.splice(index, 1);

        if (circles.value.filter(c => !c.isBlack).length === 0) {
            updateScore();
            pauseGame();
        }
    }
}

function resetGame() {
    isPaused.value = false;

    circles.value = [];

    gameConditionMessage.value = ``;

    generateCircles();
}

function endGame() {
    emit('end-game');
}

// funkcija za prikazivanje rezultata
function updateScore() {
    // za prikaz rezultata
    function updateGameConditionMessage(timeTaken) {
        gameConditionMessage.value = `TIME: ${timeTaken}s`;
    }

    // za dodavanje skora nasem gameStore-u
    function addScoreToStore(score) {
        gameStore.addScore(score);
    }

    // za kreiranje objekta skora
    function createScoreObject(timeTaken) {
        return { name: gameStore.playerName, score: timeTaken };
    }

    // za racucanje koliko vremena je trebalo do kraja igre
    function calculateTimeTaken() {
        const endTime = Date.now();
        return (endTime - startTime) / 1000; // racunamo u sekundama
    }

    // za cuvanje rezultata u local storage
    function saveScoresToLocalStorage(scores) {
        localStorage.setItem(`gameScores`, JSON.stringify(scores));
    }

    const timeTaken = calculateTimeTaken();
    const score = createScoreObject(timeTaken);

    addScoreToStore(score);
    saveScoresToLocalStorage(gameStore.scores);
    updateGameConditionMessage(timeTaken);
    pauseGame();
}

// za pauziranje igre
function pauseGame() {
    isPaused.value = true;
}

// funkcija ako nam je igra pauzirana da je nastavimo
function resumeGame() {
    if (isPaused.value) {
        resetGame();
        isPaused.value = false;
    }
}

// inicijalna funkcija koja se izvrsava kada se Gameboard aktivira
onMounted(() => { 
    generateCircles();
});
</script>

<style scoped>

.game-board {
    position: relative;
    width: 100%;
    height: 60vh;
    max-width: 100%;
    margin: 0 auto;
    background-color: #f9f9f9;
}

#circle {
    cursor: pointer;
    animation: moveAnimation 2s infinite alternate ease-in-out;
}

.container {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.btn-container {
    display: flex;
    justify-content: center;
    width: 90%;
    margin: 0 auto;
    padding: 1.5rem;
    gap: 3rem;
}

.button {
    width: 200px;
}

.button.btn-gameboard {
    width: 100%;
    max-width: 200px;
    background-color: #f9f9f9;
    color: black;
}

.game-condition-message {
    font-size: clamp(0.8rem, 2vw, 3rem);
}

.paused-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 999;
}

@keyframes moveAnimation {
    0% {
        transform: translate(0, 0);
    }

    25% {
        transform: translate(-10px, 10px);
    }

    50% {
        transform: translate(20px, -20px);
    }

    75% {
        transform: translate(-20px, -10px);
    }

    100% {
        transform: translate(0, 0);
    }
}
</style>