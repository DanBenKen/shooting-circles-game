<template>
    <section class="userinput-section">
        <div class="input-form">
            <h2>SHOOTING CIRCLES!</h2>
    
            <form @submit.prevent="handleStartGame">
                <div class="form-group">
                    <span :class="{ error: true, visible: errors.playerName }">{{ errors.playerName }}</span>
                    <input type="text" id="playerName" v-model="playerName" placeholder="Enter your name" autocomplete="off">
    
                    <span :class="{ error: true, visible: errors.circleCount }">{{ errors.circleCount }}</span>
                    <input type="number" id="circleCount" v-model="circleCount" min="1" placeholder="Enter number of circles" autocomplete="off">
    
                    <span :class="{ error: true, visible: errors.circleColors }">{{ errors.circleColors }}</span>
                    <input type="text" id="circleColors" v-model="circleColors" placeholder="Enter colors of circles (red, blue, green, purple)" autocomplete="off">
    
                    <button type="submit" class="button" :class="{ shake: isShaking }">Start Game</button>
                </div>
            </form>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import { useGameStore } from '@/stores/gameStore';

// emit-ujemo 'start-game' event nasem perent elementu
const emit = defineEmits(['start-game']);

const gameStore = useGameStore();

// reaktivne variable za formu i validaciju
const isShaking = ref(false);
const playerName = ref('');
const circleCount = ref('');
const circleColors = ref('');
const errors = ref({
    playerName: '',
    circleCount: '',
    circleColors: '',
});

// funkcija za validaciju User Input-a u formi
function validateInputs() {
    // funkcija za proveru da li je korisnik uneo boju
    function isValidColor(color) {
        const colorElement = document.createElement(`div`);
        colorElement.style.color = color;
        return colorElement.style.color !== ``;
    }

    // validacija player name
    function validatePlayerName(name) {
        if (name.trim() === ``) {
            errors.value.playerName = `Player name is required`;
            return false;
        }

        errors.value.playerName = ``;
        return true;
    }

    // validacija circle count
    function validateCircleCount(count) {
        if (count < 1 || isNaN(count)) {
            errors.value.circleCount = `Please enter a valid number of circles`;
            return false;
        }

        errors.value.circleCount = ``;
        return true;
    }

    // validacija circle color
    function validateCircleColors(colors) {
        const colorArray = colors.split(`,`).map(color => color.trim()).filter(color => color);

        if (colorArray.length === 0) {
            errors.value.circleColors = `Please enter at least one color`;
            return { valid: false, colorArray };
        }
        else if (!colorArray.every(isValidColor)) {
            errors.value.circleColors = `One or more colors are not valid`;
            return { valid: false, colorArray };
        }

        errors.value.circleColors = ``;

        return { valid: true, colorArray };
    }

    const playerNameValid = validatePlayerName(playerName.value);
    const circleCountValid = validateCircleCount(circleCount.value);
    const { valid: circleColorsValid, colorArray } = validateCircleColors(circleColors.value);

    const valid = playerNameValid && circleCountValid && circleColorsValid;

    return { valid, colorArray };
}

// funkcija za rukovanje form-e
function handleStartGame() {
    const { valid, colorArray } = validateInputs();

    if (valid) {
        // update-ujemo nas store sa podacima
        gameStore.setPlayerName(playerName.value);
        gameStore.setCircleCount(circleCount.value);
        gameStore.setCircleColors(colorArray);

        // saljemo emit parent komponenti da okine event
        emit('start-game');
    } else {
        // ako korisnik nije proso validaciju podataka za formu, onda okidamo Shake button animaciju
        triggerShake();
    }
}

// funkcija za shake animaciju
function triggerShake() {
    isShaking.value = true;

    setTimeout(() => {
        isShaking.value = false;
    }, 500);
}
</script>

<style scoped>
.input-form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 90%;
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
}

input[type="text"],
input[type="number"] {
    width: 100%;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}

.button {
    margin-top: 20px;
    padding: 15px;
    border-radius: 4px;
}

.error {
    color: red;
    font-size: 12px;
    margin-top: 5px;
    display: block;
    min-height: 20px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.5s ease, visibility 0.5s ease;
}

.error.visible {
    opacity: 1;
    visibility: visible;
}

.shake {
    animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}
</style>