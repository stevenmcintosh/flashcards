import { cardCategories } from './config/cards.js';

const STORAGE_KEY = 'flashcards_data';
let selectedCategories = [];
let currentCards = [];
let currentCardIndex = 0;

// DOM Elements
const categorySection = document.querySelector('.category-section');
const categoryToggle = document.querySelector('.category-toggle');
const checkboxContainer = document.querySelector('.checkbox-container');
const card = document.querySelector('.card');
const questionElement = document.querySelector('.question');
const answerElement = document.querySelector('.answer');
const progressBar = document.querySelector('.progress-bar');
const categoryNameElement = document.querySelector('.category-name');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const newCardBtn = document.getElementById('newCardBtn');
const modal = document.getElementById('newCardModal');
const categorySelect = document.getElementById('categorySelect');
const saveCardBtn = document.getElementById('saveCardBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importInput = document.getElementById('importInput');
const resetBtn = document.getElementById('resetBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCardsFromStorage();
    
    // Toggle category section
    categoryToggle.addEventListener('click', () => {
        categorySection.classList.toggle('open');
        categoryToggle.classList.toggle('active');
    });
    
    // Create category checkboxes
    createCategoryCheckboxes();
    
    // Set up event listeners
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    prevBtn.addEventListener('click', showPreviousCard);
    nextBtn.addEventListener('click', showNextCard);
    newCardBtn.addEventListener('click', () => modal.style.display = 'block');
    closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    saveCardBtn.addEventListener('click', saveNewCard);
    exportBtn.addEventListener('click', exportCards);
    importBtn.addEventListener('click', () => importInput.click());
    importInput.addEventListener('change', importCards);
    resetBtn.addEventListener('click', resetStorage);
    
    // Setup shuffle button
    const shuffleBtn = document.getElementById('shuffleBtn');
    shuffleBtn.addEventListener('click', performShuffle);
    
    // Initialize with at least one category selected
    const firstCheckbox = document.querySelector('.checkbox-container input');
    if (firstCheckbox) {
        firstCheckbox.checked = true;
        updateSelectedCategories();
    }
});

function createCategoryCheckboxes() {
    checkboxContainer.innerHTML = '';
    
    Object.keys(cardCategories).forEach(category => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" value="${category}">
            ${category.charAt(0).toUpperCase() + category.slice(1)}
        `;
        checkboxContainer.appendChild(label);
        
        // Add change listener
        label.querySelector('input').addEventListener('change', updateSelectedCategories);
    });
}

function updateSelectedCategories() {
    selectedCategories = Array.from(document.querySelectorAll('.checkbox-container input:checked'))
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
    
    // Shuffle cards
    shuffleArray(currentCards);
    
    // Reset to first card
    currentCardIndex = 0;
    updateCard();
    
    // Close category section after selection on mobile
    if (window.innerWidth < 768) {
        categorySection.classList.remove('open');
        categoryToggle.classList.remove('active');
    }
}

function updateCard() {
    if (currentCards.length === 0) {
        questionElement.textContent = "Please select a category";
        answerElement.textContent = "";
        categoryNameElement.textContent = "No category selected";
        progressBar.style.width = '0%';
        document.querySelector('.cards-done').textContent = "0 cards done";
        document.querySelector('.cards-remaining').textContent = "0 cards remaining";
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
    }

    const currentCard = currentCards[currentCardIndex];
    questionElement.textContent = currentCard.question;
    answerElement.textContent = currentCard.answer;
    card.classList.remove('flipped');
    
    // Update card category display
    categoryNameElement.textContent = currentCard.category;
    
    // Update card color based on category
    const categoryColor = cardCategories[currentCard.category].colour;
    document.querySelector('.card-front').style.backgroundColor = categoryColor;
    document.querySelector('.card-back').style.backgroundColor = categoryColor;

    // Update progress
    const progress = ((currentCardIndex + 1) / currentCards.length) * 100;
    progressBar.style.width = `${progress}%`;
    document.querySelector('.cards-done').textContent = `${currentCardIndex} cards done`;
    document.querySelector('.cards-remaining').textContent = `${currentCards.length - currentCardIndex - 1} cards remaining`;

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

function performShuffle() {
    // Guard clauses
    if (currentCards.length <= 1) {
        return; // Nothing to shuffle
    }
    
    // If we're on the last card, nothing to shuffle
    if (currentCardIndex >= currentCards.length - 1) {
        return;
    }
    
    // Keep already viewed cards (excluding current card)
    const viewedCards = currentCards.slice(0, currentCardIndex);
    
    // Take current card and remaining cards to shuffle together
    const cardsToShuffle = currentCards.slice(currentCardIndex);
    
    // Shuffle the current and remaining cards
    shuffleArray(cardsToShuffle);
    
    // Combine arrays: viewed cards + shuffled (current and remaining) cards
    currentCards = [...viewedCards, ...cardsToShuffle];
    
    // Update display
    updateCard();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
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
                
                // Refresh categories and selected cards
                createCategoryCheckboxes();
                updateSelectedCategories();
            } catch (error) {
                alert('Error importing cards. Please check the file format.');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
    }
}

// Initialize category select in modal
function initializeCategorySelect() {
    categorySelect.innerHTML = '';
    Object.keys(cardCategories).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categorySelect.appendChild(option);
    });
}

// Initialize category select when modal is opened
newCardBtn.addEventListener('click', initializeCategorySelect);

function resetStorage() {
    if (confirm('Are you sure you want to reset all cards? This will remove all custom cards and return to default settings.')) {
        // Clear local storage
        localStorage.removeItem(STORAGE_KEY);
        
        // Reset to original card data
        Object.keys(cardCategories).forEach(category => {
            // If you want to completely reset all cards, use this:
            // Only keeping default categories and removing all questions
            cardCategories[category].questions = [];
        });
        
        // Alternatively, if you want to restore default cards:
        // This would need to be implemented with your default card set
        restoreDefaultCards();
        
        // Update UI
        createCategoryCheckboxes();
        selectedCategories = [];
        currentCards = [];
        currentCardIndex = 0;
        updateCard();
        
        alert('All cards have been reset to default settings.');
    }
}

function restoreDefaultCards() {
    // Default cards
    const defaultCards = {
        general: {
            colour: '#ffebee', // Light red
            questions: [
                { question: "what is the opposite of black?", answer: "white" },
                { question: "what is the opposite of hot?", answer: "cold" }
            ]
        },
        maths: {
            colour: '#e3f2fd', // Light blue
            questions: [
                { question: "what is 5+5?", answer: "10" },
                { question: "what is 7x7?", answer: "49" }
            ]
        },
        science: {
            colour: '#f1f8e9', // Light green
            questions: [
                { question: "Name three states?", answer: "gas, liquid, solid" },
                { question: "What happens to a solid under heat?", answer: "melts into a liquid" }
            ]
        }
    };
    
    // Reset to default cards
    Object.keys(defaultCards).forEach(category => {
        if (cardCategories[category]) {
            cardCategories[category].questions = [...defaultCards[category].questions];
        } else {
            cardCategories[category] = {
                colour: defaultCards[category].colour,
                questions: [...defaultCards[category].questions]
            };
        }
    });
} 