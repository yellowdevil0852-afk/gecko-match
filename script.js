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
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalCloseBtn = document.getElementById('modal-close-btn');

// Master Pool (Exactly 12 Good cards and 6 Bad cards)
const allBehaviors = [
    // --- good behaviors (12 pairs) ---
    { id: 1, content: './images/calcium dusting.png', label: '補充鈣粉', type: 'good', description: '鈣質對守宮的骨骼發育至關重要。定期在昆蟲飼料中裹上適量鈣粉，能有效預防守宮罹患嚴重的代謝性骨病。' },
    { id: 2, content: './images/correct insect size.png', label: '合適的昆蟲大小', type: 'good', description: '餵食的昆蟲長度不應超過守宮兩眼之間的距離。過大的食物容易導致守宮哽噎、吐食或壓迫消化系統。' },
    { id: 3, content: './images/cup-hand holding.png', label: '雙手捧抱守宮', type: 'good', description: '與守宮互動時，應使用雙手從下方輕輕托起、捧在掌心。這能給牠們足夠的安全感，並降低意外摔落的機率。' },
    { id: 4, content: './images/fresh water.png', label: '提供乾淨飲水', type: 'good', description: '守宮需要每天更換乾淨的過濾水或常溫熟水。不乾淨的水源容易滋生細菌，導致腸胃發炎。' },
    { id: 5, content: './images/humid hide.png', label: '設置濕度躲避處', type: 'good', description: '在飼養箱內放置鋪有濕水苔或濕廚房紙巾的躲避穴。維持局部的微高濕度環境，能幫助守宮順利完成脫皮。' },
    { id: 6, content: './images/locking the cage.png', label: '鎖好飼養箱門', type: 'good', description: '守宮是非常厲害的越獄大師！每次餵食或清理完畢後，務必確認箱門已確實扣緊或上鎖，防止寵物走失。' },
    { id: 7, content: './images/perfect shed check.png', label: '檢查是否完全脫皮', type: 'good', description: '脫皮結束後，記得仔細檢查守宮的腳趾和尾尖。殘留的舊皮如果沒有及時清掉，會隨著時間乾枯並勒緊血管，導致腳趾壞死。' },
    { id: 8, content: './images/pre-handling hand wash.png', label: '互動前確實洗手', type: 'good', description: '抓取或接觸守宮前後都應該把手洗乾淨。這不僅能防止我們身上的細菌或化學殘留物影響爬蟲，也能保護飼主的衛生。' },
    { id: 9, content: './images/quiet observing.png', label: '安靜觀察不打擾', type: 'good', description: '守宮是害羞的夜行性爬蟲。白天牠們多在睡覺，保持環境安靜、減少過度打擾，能大大降低寵物的精神壓力。' },
    { id: 10, content: './images/safe substrate.png', label: '使用安全墊材', type: 'good', description: '建議使用廚房紙巾、爬蟲墊或防滑沖孔墊作為底材。避免使用細沙或碎木屑，以防守宮在捕食時誤食導致腸胃阻塞。' },
    { id: 11, content: './images/spot cleaning.png', label: '每日局部清理', type: 'good', description: '每天花一分鐘夾走便便、清除髒污的墊材，能有效抑止環境細菌與寄生蟲滋生，給守宮一個乾淨清爽的家。' },
    { id: 12, content: './images/thermometer check.png', label: '檢查溫度計數值', type: 'good', description: '守宮是冷血動物，環境溫度直接影響消化功能。應每天檢查溫溼度計，確保環境維持在舒適的範圍內。' },

    // --- bad behaviors (6 pairs) ---
    { id: 100, content: './images/dirty water.png', label: '髒亂的水源', type: 'hazard', description: '長時間不更換的水盆會黏附排泄物或死昆蟲，滋生致命菌群。守宮飲用後極易引發嚴重的消化道感染或拒食。' },
    { id: 101, content: './images/glass tapping.png', label: '拍擊玻璃箱', type: 'hazard', description: '拍擊或大力敲打玻璃飼養箱會產生劇烈的震動與噪音，對聽覺敏銳、膽小的守宮來說，這就像地震一樣可怕，會引發極大恐慌。' },
    { id: 102, content: './images/harsh sunlight.png', label: '陽光強烈直射', type: 'hazard', description: '守宮屬於夜行性動物，皮膚薄弱，無法承受強光。陽光直射飼養箱會引發溫室效應，使箱內溫度飆升，導致守宮中暑甚至死亡。' },
    { id: 103, content: './images/high handling fall risk.jpeg', label: '在高處把玩', type: 'hazard', description: '站在高處把玩或將守宮放在高桌上非常危險。一旦守宮受驚向前竄跳，摔落地面可能會導致嚴重的內出血或骨折。' },
    { id: 104, content: './images/tail grabbing.png', label: '用力抓扯尾巴', type: 'hazard', description: '絕對不能用力抓扯守宮的尾巴！當牠們感受到強烈危險時，會啟動自切防禦機制——直接斷尾求生。雖然會慢慢長回來，但對身體元氣傷害極大。' },
    { id: 105, content: './images/wild bug danger.png', label: '餵食不明野外昆蟲', type: 'hazard', description: '野外捕捉的昆蟲體內通常含有未知的寄生蟲，甚至可能沾染了農藥或殺蟲劑。餵食野生昆蟲極容易導致守宮中毒身亡。' }
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

    if (
        clickedCard.classList.contains('flipped') ||
        clickedCard.classList.contains('matched') ||
        flippedCards.length >= 2
    ) {
        return;
    }

    const cardId = clickedCard.dataset.id;
    const cardMatchData = allBehaviors.find(item => item.id == cardId);

    clickedCard.classList.add('flipped');
    clickedCard.innerHTML = `
        <img src="${cardMatchData.content}" alt="${cardMatchData.label}" class="card-img">
        <span class="card-text">${cardMatchData.label}</span>
    `;
    clickedCard.setAttribute('aria-label', cardMatchData.label);

    flippedCards.push(clickedCard);
    flips++;
    flipDisplay.textContent = flips;

    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

function handleCardDblClick(e) {
    const cardId = e.currentTarget.dataset.id;
    const cardMatchData = allBehaviors.find(item => item.id == cardId);
    const infoCard = document.querySelector('.modal-info-card');
    
    modalImg.src = cardMatchData.content;
    modalTitle.textContent = cardMatchData.label;
    modalDescription.textContent = cardMatchData.description || '暫無相關習慣說明。';
    
    if (cardMatchData.type === 'hazard') {
        infoCard.classList.add('hazard-style');
    } else {
        infoCard.classList.remove('hazard-style');
    }
    
    imageModal.classList.add('active');
}

// Close Modal Function
function closeModal() {
    imageModal.classList.remove('active');
    setTimeout(() => {
        modalImg.src = '';
    }, 300);
}

modalCloseBtn.addEventListener('click', closeModal);
imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
        closeModal();
    }
});

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