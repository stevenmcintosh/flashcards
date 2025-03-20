import { cardCategories } from './config/cards.js';

const STORAGE_KEY = 'flashcards_data';
let selectedCategories = [];
let currentCards = [];
let currentCardIndex = 0;

// DOM Elements
const categoryCheckboxesDiv = document.querySelector('.category-checkboxes');
const startBtn = document.getElementById('startBtn');
const cardInterface = document.querySelector('.card-interface');
const card = document.querySelector('.card');
const questionElement = document.querySelector('.question');
const answerElement = document.querySelector('.answer');
const progressBar = document.querySelector('.progress-bar');
const progressText = document.querySelector('.progress-text');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const newCardBtn = document.getElementById('newCardBtn');
const modal = document.getElementById('newCardModal');
const categorySelect = document.getElementById('categorySelect');
const saveCardBtn = document.getElementById('saveCardBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

// Initialize category checkboxes
Object.keys(cardCategories).forEach(category => {
    const label = document.createElement('label');
    label.className = 'category-checkbox';
    label.innerHTML = `
        <input type="checkbox" value="${category}">
        ${category.charAt(0).toUpperCase() + category.slice(1)}
    `;
    categoryCheckboxesDiv.appendChild(label);
});

// Event Listeners
startBtn.addEventListener('click', startLearning);
card.addEventListener('click', () => card.classList.toggle('flipped'));
prevBtn.addEventListener('click', showPreviousCard);
nextBtn.addEventListener('click', showNextCard);
newCardBtn.addEventListener('click', () => modal.style.display = 'block');
closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
saveCardBtn.addEventListener('click', saveNewCard);

function startLearning() {
    selectedCategories = Array.from(document.querySelectorAll('.category-checkbox input:checked'))
        .map(checkbox => checkbox.value);
    
    if (selectedCategories.length === 0) {
        alert('Please select at least one category');
        return;
    }

    document.querySelector('.category-selection').style.display = 'none';
    document.querySelector('.card-interface').style.display = 'block';
    
    createCategoryFilters();
    updateSelectedCategories();
}

function updateCard() {
    if (currentCards.length === 0) {
        questionElement.textContent = "Please select at least one category";
        document.querySelector('.card-header').textContent = "";
        return;
    }

    console.log(`Current card index: ${currentCardIndex} of ${currentCards.length} cards`);
    
    const currentCard = currentCards[currentCardIndex];
    questionElement.textContent = currentCard.question;
    answerElement.textContent = currentCard.answer;
    card.classList.remove('flipped');
    
    // Update card category display
    document.querySelector('.card-header').textContent = `Category: ${currentCard.category}`;
    
    // Update card colour
    const categoryColor = cardCategories[currentCard.category].colour;
    document.querySelector('.card-front').style.backgroundColor = categoryColor;
    document.querySelector('.card-back').style.backgroundColor = categoryColor;

    // Update progress
    const progress = ((currentCardIndex + 1) / currentCards.length) * 100;
    progressBar.style.width = `${progress}%`;
    updateProgressDetails();

    // Update navigation buttons
    prevBtn.disabled = currentCardIndex === 0;
    nextBtn.disabled = currentCardIndex === currentCards.length - 1;
}

function showPreviousCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        updateCard();
    }
}

function showNextCard() {
    if (currentCardIndex < currentCards.length - 1) {
        currentCardIndex++;
        updateCard();
    }
}

function loadCardsFromStorage() {
    const savedCards = localStorage.getItem(STORAGE_KEY);
    if (savedCards) {
        try {
            const parsedCards = JSON.parse(savedCards);
            Object.assign(cardCategories, parsedCards);
        } catch (error) {
            console.error('Error loading cards:', error);
        }
    }
}

function saveCardsToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cardCategories));
    } catch (error) {
        console.error('Error saving cards:', error);
    }
}

function saveNewCard() {
    const category = categorySelect.value;
    const question = document.getElementById('newQuestion').value.trim();
    const answer = document.getElementById('newAnswer').value.trim();

    if (!category || !question || !answer) {
        alert('Please fill in all fields');
        return;
    }

    cardCategories[category].questions.push({ question, answer });
    saveCardsToStorage();
    
    if (selectedCategories.includes(category)) {
        currentCards.push({ question, answer, category });
        shuffleArray(currentCards);
    }
    
    alert('Card saved successfully!');
    
    modal.style.display = 'none';
    document.getElementById('newQuestion').value = '';
    document.getElementById('newAnswer').value = '';
}

function exportCards() {
    const dataStr = JSON.stringify(cardCategories, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'flashcards_backup.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function importCards(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedCards = JSON.parse(e.target.result);
                Object.assign(cardCategories, importedCards);
                saveCardsToStorage();
                alert('Cards imported successfully!');
                location.reload();
            } catch (error) {
                alert('Error importing cards. Please check the file format.');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
    }
}

function addImportExportButtons() {
    // Remove any existing import/export buttons
    const existingButtons = document.querySelectorAll('.import-export-buttons');
    existingButtons.forEach(buttons => buttons.remove());

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'import-export-buttons';
    buttonsDiv.innerHTML = `
        <div class="secondary-nav">
            <button id="exportBtn" class="nav-button secondary">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                </svg>
                Export Cards
            </button>
            <input type="file" id="importInput" accept=".json" style="display: none;">
            <button id="importBtn" class="nav-button secondary">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                </svg>
                Import Cards
            </button>
        </div>
    `;
    
    // Add the buttons after the existing navigation buttons
    const navigationContainer = document.querySelector('.navigation-container');
    navigationContainer.appendChild(buttonsDiv);
    
    // Add event listeners
    document.getElementById('exportBtn').addEventListener('click', exportCards);
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importInput').click();
    });
    document.getElementById('importInput').addEventListener('change', importCards);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Initialize category select in modal
Object.keys(cardCategories).forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categorySelect.appendChild(option);
});

// Initialize the application
loadCardsFromStorage();
addImportExportButtons();

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    startBtn.addEventListener('click', startLearning);
    
    // Initialize the application
    loadCardsFromStorage();
    addImportExportButtons();
    
    const shuffleBtn = document.getElementById('shuffleBtn');
    shuffleBtn.addEventListener('click', performShuffle);
});

function updateProgressDetails() {
    const cardsDone = currentCardIndex;
    const cardsRemaining = currentCards.length - currentCardIndex - 1;
    
    document.querySelector('.cards-done').textContent = `${cardsDone} cards done`;
    document.querySelector('.cards-remaining').textContent = `${cardsRemaining} cards remaining`;
}

function createCategoryFilters() {
    const filtersDiv = document.querySelector('.category-filters');
    filtersDiv.innerHTML = '<h4>Filter Categories:</h4>';
    
    Object.keys(cardCategories).forEach(category => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" value="${category}" 
                   ${selectedCategories.includes(category) ? 'checked' : ''}>
            ${category.charAt(0).toUpperCase() + category.slice(1)}
        `;
        filtersDiv.appendChild(label);
        
        // Add change listener
        label.querySelector('input').addEventListener('change', updateSelectedCategories);
    });
}

function updateSelectedCategories() {
    selectedCategories = Array.from(document.querySelectorAll('.category-filters input:checked'))
        .map(checkbox => checkbox.value);
    
    if (selectedCategories.length === 0) {
        currentCards = [];
        updateCard();
        return;
    }
    
    // Update cards array
    currentCards = selectedCategories.flatMap(category => 
        cardCategories[category].questions.map(q => ({
            ...q,
            category
        }))
    );
    
    // Shuffle all cards initially
    const tempCards = [...currentCards];
    shuffleArray(tempCards);
    currentCards = tempCards;
    
    // Reset to first card
    currentCardIndex = 0;
    updateCard();
}

function performShuffle() {
    console.log("Shuffle button clicked");
    
    // Guard clauses - return early if nothing to shuffle
    if (!currentCards || currentCards.length <= 1) {
        console.log("Not enough cards to shuffle");
        return;
    }
    
    if (currentCardIndex >= currentCards.length - 1) {
        console.log("Already at last card, nothing to shuffle");
        return;
    }
    
    console.log(`Current index: ${currentCardIndex}, Total cards: ${currentCards.length}`);
    
    // Create copies of arrays to avoid reference issues
    const seenCards = [...currentCards.slice(0, currentCardIndex + 1)];
    const unseenCards = [...currentCards.slice(currentCardIndex + 1)];
    
    console.log(`Cards to keep: ${seenCards.length}, Cards to shuffle: ${unseenCards.length}`);
    
    // Manual shuffle of unseen cards using Fisher-Yates algorithm
    for (let i = unseenCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements
        const temp = unseenCards[i];
        unseenCards[i] = unseenCards[j];
        unseenCards[j] = temp;
    }
    
    // Combine arrays
    currentCards = [...seenCards, ...unseenCards];
    
    console.log("Shuffle complete");
    
    // Force a display update
    updateCard();
} 