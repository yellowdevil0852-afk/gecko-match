// 1. DOM Elements (Moved safely to the top)
const gameGrid = document.getElementById('game-grid');
const scoreDisplay = document.getElementById('score');
const flipDisplay = document.getElementById('flip-count'); 
const restartBtn = document.getElementById('restart-btn');
const difficultySelect = document.getElementById('difficulty');

// 2. Master Pool (Exactly 12 Good cards and 6 Bad cards)
const allBehaviors = [
    // --- GOOD CARDS (Exactly 12 Items) ---
    { id: 1, content: '💧', label: 'Fresh Water', type: 'good' },
    { id: 2, content: '☀️', label: 'UV Light', type: 'good' },
    { id: 3, content: '🦗', label: 'Healthy Cricket', type: 'good' },
    { id: 4, content: '🪵', label: 'Humid Hide', type: 'good' },
    { id: 5, content: '🌡️', label: 'Warm Mat', type: 'good' },
    { id: 6, content: '🍃', label: 'Terrarium Plant', type: 'good' },
    { id: 7, content: '🦎', label: 'Gentle Handling', type: 'good' },
    { id: 8, content: '🧼', label: 'Clean Tank', type: 'good' },
    { id: 9, content: '🪨', label: 'Climbing Rock', type: 'good' },
    { id: 10, content: '💊', label: 'Calcium Powder', type: 'good' },
    { id: 11, content: '🍌', label: 'Fruit Treat', type: 'good' },
    { id: 12, content: '👁️', label: 'Clear Eyes Check', type: 'good' },

    // --- HAZARD CARDS / BAD CARDS (Exactly 6 Items) ---
    { id: 100, content: '💥', label: 'BOOM! Toxic Chemical', type: 'hazard' },
    { id: 101, content: '🍫', label: 'BOOM! Dangerous Chocolate', type: 'hazard' },
    { id: 102, content: '🥶', label: 'BOOM! Freezing Draft', type: 'hazard' },
    { id: 103, content: '🕷️', label: 'BOOM! Wild Spider', type: 'hazard' },
    { id: 104, content: '🔥', label: 'BOOM! Overheating', type: 'hazard' },
    { id: 105, content: '🥤', label: 'BOOM! Sugary Soda', type: 'hazard' }
];

// 3. Difficulty Settings Configuration (Fixed Hard Mode cols back to 9)
const difficultySettings = {
    low: { goodPairs: 4, badPairs: 2, cols: 4 },     // 12 cards total (4x3)
    medium: { goodPairs: 8, badPairs: 4, cols: 6 },  // 24 cards total (6x4)
    hard: { goodPairs: 12, badPairs: 6, cols: 9 }    // 36 cards total (9x4)
};

// 4. Game State Variables
let currentSettings = difficultySettings.medium;
let cardsData = [];
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let flips = 0;

// Fisher-Yates Shuffle Algorithm
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize the game board
function initGame() {
    gameGrid.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    score = 0;
    flips = 0;
    scoreDisplay.textContent = score;
    flipDisplay.textContent = flips;

    gameGrid.setAttribute('data-difficulty', difficultySelect.value);
    gameGrid.style.setProperty('--grid-cols', currentSettings.cols);

    // 1. Gather Good Pairs
    const goodPool = allBehaviors.filter(item => item.type === 'good');
    const selectedGood = goodPool.slice(0, currentSettings.goodPairs);
    const goodCards = [...selectedGood, ...selectedGood];

    // 2. Gather Bad Pairs
    const badPool = allBehaviors.filter(item => item.type === 'hazard');
    const selectedBad = badPool.slice(0, currentSettings.badPairs);
    const badCards = [...selectedBad, ...selectedBad];
    
    // 3. Combine and Shuffle
    cardsData = [...goodCards, ...badCards];
    shuffle(cardsData);

    // 4. Render Layout
    cardsData.forEach((cardInfo, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        cardElement.dataset.id = cardInfo.id;
        cardElement.dataset.type = cardInfo.type; 
        cardElement.setAttribute('aria-label', 'Hidden card');
        
        cardElement.addEventListener('click', handleCardClick);
        gameGrid.appendChild(cardElement);
    });
}

// Card Click Logic
function handleCardClick(e) {
    const clickedCard = e.currentTarget;

    if (clickedCard.classList.contains('flipped') || 
        clickedCard.classList.contains('matched') || 
        flippedCards.length === 2) {
        return;
    }

    flips++;
    flipDisplay.textContent = flips;

    const cardId = clickedCard.dataset.id;
    const cardMatchData = allBehaviors.find(item => item.id == cardId);

    clickedCard.classList.add('flipped');
    clickedCard.textContent = cardMatchData.content;
    clickedCard.setAttribute('aria-label', cardMatchData.label);

    flippedCards.push(clickedCard);

    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

// Matching Rule Processor
function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.id === card2.dataset.id) {
        
        // Hazard Boom Match Rule
        if (card1.dataset.type === 'hazard') {
            card1.classList.add('matched', 'hazard');
            card2.classList.add('matched', 'hazard');

            score = Math.max(0, score - 10);
            scoreDisplay.textContent = score;
            flippedCards = [];

        // Success Good Match Rule
        } else {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++; 
            
            score += 10;
            scoreDisplay.textContent = score;
            flippedCards = [];

            if (matchedPairs === currentSettings.goodPairs) {
                setTimeout(() => {
                    alert(`Congratulations! You found all healthy habits and kept the gecko safe! 🎉\nFinal Score: ${score}\nTotal Flips: ${flips}`);
                }, 300);
            }
        }
    } else {
        // Mismatch turnaround
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
            card1.setAttribute('aria-label', 'Hidden card');
            card2.setAttribute('aria-label', 'Hidden card');
            flippedCards = [];
        }, 1000);
    }
}

// Difficulty Dropdown Listener
difficultySelect.addEventListener('change', (e) => {
    currentSettings = difficultySettings[e.target.value];
    initGame(); 
});

restartBtn.addEventListener('click', initGame);

// Initial Execution call
initGame();