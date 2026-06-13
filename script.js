// DOM Elements (Moved safely to the top)
const gameGrid = document.getElementById('game-grid');
const scoreDisplay = document.getElementById('score');
const flipDisplay = document.getElementById('flip-count'); 
const restartBtn = document.getElementById('restart-btn');
const showAllBtn = document.getElementById('show-all-btn');
const difficultySelect = document.getElementById('difficulty');
const viewModeSelect = document.getElementById('view-mode');
const imageModal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');
const modalCloseBtn = document.getElementById('modal-close-btn');

// Master Pool (Exactly 12 Good cards and 6 Bad cards)
const allBehaviors = [
    // --- good behaviors (Exactly 12 Items) ---
    { id: 1, content: 'images/calcium dusting.png', label: '補充鈣粉', type: 'good' },
    { id: 2, content: 'images/correct insect size.png', label: '合適的昆蟲大小', type: 'good' },
    { id: 3, content: 'images/cup-hand holding.png', label: '雙手捧抱守宮', type: 'good' },
    { id: 4, content: 'images/fresh water.png', label: '提供乾淨乾淨飲水', type: 'good' },
    { id: 5, content: 'images/humid hide.png', label: '設置濕度躲避處', type: 'good' },
    { id: 6, content: 'images/locking the cage.png', label: '鎖好飼養箱門', type: 'good' },
    { id: 7, content: 'images/perfect shed check.png', label: '檢查是否完全脫皮', type: 'good' },
    { id: 8, content: 'images/pre-handling hand wash.png', label: '互動前洗手', type: 'good' },
    { id: 9, content: 'images/quiet observing.png', label: '安靜觀察不打擾', type: 'good' },
    { id: 10, content: 'images/safe substrate.png', label: '使用安全墊材', type: 'good' },
    { id: 11, content: 'images/spot cleaning.png', label: '每日局部清理', type: 'good' },
    { id: 12, content: 'images/thermometer check.png', label: '檢查溫度計數值', type: 'good' },

    // --- hazard cards (Exactly 6 Items) ---
    { id: 100, content: 'images/dirty water.png', label: '髒亂的水源', type: 'hazard' },
    { id: 101, content: 'images/glass tapping.png', label: '拍擊玻璃箱', type: 'hazard' },
    { id: 102, content: 'images/harsh sunlight.png', label: '陽光強烈直射', type: 'hazard' },
    { id: 103, content: 'images/high handling fall risk.jpeg', label: '在高處把玩', type: 'hazard' },
    { id: 104, content: 'images/tail grabbing.png', label: '用力抓扯尾巴', type: 'hazard' },
    { id: 105, content: 'images/wild bug danger.png', label: '餵食不明野外昆蟲', type: 'hazard' }
];

// Difficulty Settings Configuration (Fixed Hard Mode cols back to 9)
const difficultySettings = {
    low: { goodPairs: 4, badPairs: 2, cols: 4 },     // 12 cards total (4x3)
    medium: { goodPairs: 8, badPairs: 4, cols: 6 },  // 24 cards total (6x4)
    hard: { goodPairs: 12, badPairs: 6, cols: 6 }    // 36 cards total (6x6)
};

// Game State Variables
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
    gameGrid.className = `game-grid ${viewModeSelect.value}`;

    // 1. Gather Good and Bad Pairs
    const goodPool = allBehaviors.filter(item => item.type === 'good');
    const badPool = allBehaviors.filter(item => item.type === 'hazard');

    shuffle(goodPool);
    shuffle(badPool);
    // 2. Select the required number of pairs based on current settings
    const selectedGood = goodPool.slice(0, currentSettings.goodPairs);
    const selectedBad = badPool.slice(0, currentSettings.badPairs);
    
    // 3. Create the card data array with pairs duplicated for matching
    const goodCards = [...selectedGood, ...selectedGood];
    const badCards = [...selectedBad, ...selectedBad];
    
    // 4. Combine and shuffle the final card data
    cardsData = [...goodCards, ...badCards];
    shuffle(cardsData);

    // 5. Render Layout
    cardsData.forEach((cardInfo, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        cardElement.dataset.id = cardInfo.id;
        cardElement.dataset.type = cardInfo.type; 
        cardElement.setAttribute('aria-label', 'Hidden card');
        
        cardElement.addEventListener('click', handleCardClick);
        cardElement.addEventListener('dblclick', handleCardDblClick);
        gameGrid.appendChild(cardElement);
    });

    showAllCards();
}

function showAllCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const cardId = card.dataset.id;
        const cardMatchData = allBehaviors.find(item => item.id == cardId);
        card.classList.add('flipped');
        card.innerHTML = `
            <img src="${cardMatchData.content}" alt="${cardMatchData.label}" class="card-img">
            <span class="card-text">${cardMatchData.label}</span>
        `;
    });

    setTimeout(() => {
        cards.forEach(card => {
            if (!card.classList.contains('matched')) {
                card.classList.remove('flipped');
                card.innerHTML = '';
            }
        });
    }, 5000);
}

// Card Click Logic
function handleCardClick(e) {
    const clickedCard = e.currentTarget;

    if (clickedCard.classList.contains('flipped') || 
        clickedCard.classList.contains('matched') || 
        flippedCards.length === 2) {
        return;
    }

    const cardId = clickedCard.dataset.id;
    const cardMatchData = allBehaviors.find(item => item.id == cardId);

    clickedCard.classList.add('flipped');
    clickedCard.setAttribute('aria-label', cardMatchData.label);
    clickedCard.innerHTML = `
        <img src="${cardMatchData.content}" alt="${cardMatchData.label}" class="card-img">
        <span class="card-text">${cardMatchData.label}</span>
    `;
    
    clickedCard.setAttribute('aria-label', cardMatchData.label);
    
    clickedCard.setAttribute('aria-label', cardMatchData.label);

    flippedCards.push(clickedCard);

    if (flippedCards.length === 2) {
        flips++;
        flipDisplay.textContent = flips;
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
                    alert(`恭喜你！你找到了所有守宮的健康好習慣，成功讓守宮安全健康！🎉\n最終得分: ${score}\n總翻牌次數: ${flips}`);
                }, 300);
            }
        }
    } else {
        // Safe mismatch transition
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.innerHTML = '';
            card2.innerHTML = '';
            card1.setAttribute('aria-label', 'Hidden card');
            card2.setAttribute('aria-label', 'Hidden card');
            flippedCards = [];
        }, 1000);
    }
}

// Double Click Handler to open modal pop-up window
function handleCardDblClick(e) {
    const cardId = e.currentTarget.dataset.id;
    const cardMatchData = allBehaviors.find(item => item.id == cardId);
    
    // Set the source image path and text title label inside modal window
    modalImg.src = cardMatchData.content;
    modalCaption.textContent = cardMatchData.label.replace('💥 糟糕！', ''); // Clean hazard prefix out if wanted
    
    // Smoothly turn on overlay display
    imageModal.classList.add('active');
}

// Close Modal Window Function
function closeModal() {
    imageModal.classList.remove('active');
    setTimeout(() => {
        modalImg.src = ''; // Clear image asset once faded out to preserve bandwidth
    }, 300);
}

// Close button triggers close
modalCloseBtn.addEventListener('click', closeModal);

// Optional UX: Clicking the dark blurred overlay background also exits the window cleanly
imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
        closeModal();
    }
});

// Difficulty Dropdown Listener
difficultySelect.addEventListener('change', (e) => {
    currentSettings = difficultySettings[e.target.value];
    initGame(); 
});

restartBtn.addEventListener('click', initGame);
showAllBtn.addEventListener('click', showAllCards);
viewModeSelect.addEventListener('change', (e) => {
    // Dynamically swap the class layout on the grid container wrapper
    gameGrid.className = `game-grid ${e.target.value}`;
});

// Initial Execution call
initGame();