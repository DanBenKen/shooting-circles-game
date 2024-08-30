import { defineStore } from "pinia";
import { ref } from "vue";

export const useGameStore = defineStore(`gameStore`, () => {
    const playerName = ref("");
    const circleCount = ref(1);
    const circleColors = ref([]);
    const scores = ref(JSON.parse(localStorage.getItem(`gameScores`)) || []);

    // postavljamo player's name
    function setPlayerName(name) {
        playerName.value = name;
    }

    // postavljamo broj krugova
    function setCircleCount(count) {
        circleCount.value = count;
    }

    // postavljanje boje krugova
    function setCircleColors(colors) {
        circleColors.value = colors;
    }

    // dodajemo rezultat na scores i dodajemo na local storage
    function addScore(score) {
        scores.value.push(score);
        saveScoresToLocalStorage();
    }

    // funkcija za cuvanje scores na local storage
    function saveScoresToLocalStorage() {
        localStorage.setItem(`gameScores`, JSON.stringify(scores.value));
    }

    // funkcija za dobijanje top rezultata, defaultno postavaljamo na 5
    function getTopScores(limit = 5) {
        if (!Array.isArray(scores.value)) return [];

        return scores.value
            .sort((a, b) => a.score - b.score)
            .slice(0, limit);
    }

    return {
        playerName,
        circleCount,
        circleColors,
        scores,
        setPlayerName,
        setCircleCount,
        setCircleColors,
        addScore,
        getTopScores,
    };
});
