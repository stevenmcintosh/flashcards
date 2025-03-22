// Define card categories directly in the script
const cardCategories = {
    Maths: {
        colour: '#e3f2fd', // Light blue
        questions: [
            { question: "What is the value of π (to 2 decimal places)?", answer: "3.14" },
            { question: "What is 12 squared?", answer: "144" },
            { question: "What is the mode in a set of numbers?", answer: "The most frequent number" },
            { question: "Solve: 3x = 12. What is x?", answer: "4" },
            { question: "What is 25% of 80?", answer: "20" },
            { question: "How many degrees in a right angle?", answer: "90" },
            { question: "What is the perimeter of a rectangle with sides 4cm and 6cm?", answer: "20cm" },
            { question: "What is 0.75 as a fraction?", answer: "3/4" },
            { question: "What is the formula for the area of a triangle?", answer: "½ × base × height" },
            { question: "What is 3³ (3 to the power of 3)?", answer: "27" }
        ]
    },
    Science: {
        colour: '#f1f8e9', // Light green
        questions: [
            { question: "What force pulls objects towards Earth?", answer: "Gravity" },
            { question: "What gas do we breathe in from the air?", answer: "Oxygen" },
            { question: "What part of the cell controls activities?", answer: "Nucleus" },
            { question: "What is H₂O?", answer: "Water" },
            { question: "What is the centre of an atom called?", answer: "Nucleus" },
            { question: "Name the three states of matter.", answer: "Solid, liquid, gas" },
            { question: "What happens to water when it boils?", answer: "Turns into steam/gas" },
            { question: "What is photosynthesis?", answer: "Plants making food using sunlight" },
            { question: "What organ pumps blood around the body?", answer: "Heart" },
            { question: "What is the chemical symbol for Iron?", answer: "Fe" }
        ]
    },
    Geography: {
        colour: '#fff3e0', // Light orange
        questions: [
            { question: "What is the capital of France?", answer: "Paris" },
            { question: "Name a continent that starts with 'A'.", answer: "Africa, Asia, Antarctica, Australia" },
            { question: "What is the longest river in the world?", answer: "The Nile" },
            { question: "Which ocean is the largest?", answer: "Pacific Ocean" },
            { question: "What country is famous for pyramids?", answer: "Egypt" },
            { question: "What do we call the lines that run east to west on a map?", answer: "Latitude" },
            { question: "What natural disaster is measured using the Richter scale?", answer: "Earthquake" },
            { question: "Which country has the most people?", answer: "China" },
            { question: "What is the UK’s highest mountain?", answer: "Ben Nevis" },
            { question: "What is a rainforest?", answer: "A dense forest with high rainfall" }
        ]
    },
    English: {
        colour: '#ede7f6', // Light purple
        questions: [
            { question: "What is a noun?", answer: "A person, place, or thing" },
            { question: "What is a verb?", answer: "An action word" },
            { question: "What is an adjective?", answer: "A word that describes a noun" },
            { question: "What is a synonym for 'happy'?", answer: "Joyful, cheerful, glad" },
            { question: "What is a metaphor?", answer: "A comparison without using 'like' or 'as'" },
            { question: "What does 'foreshadowing' mean in literature?", answer: "Hinting at future events" },
            { question: "What is the past tense of 'run'?", answer: "Ran" },
            { question: "Name a Shakespeare play.", answer: "Romeo and Juliet, Macbeth, Hamlet, etc." },
            { question: "What is the plural of 'mouse'?", answer: "Mice" },
            { question: "What punctuation ends a question?", answer: "Question mark (?)" }
        ]
    },
    General: {
        colour: '#ffebee', // Light red
        questions: [
            { question: "What is the opposite of day?", answer: "Night" },
            { question: "What colour do you get when you mix red and blue?", answer: "Purple" },
            { question: "What is the freezing point of water (°C)?", answer: "0°C" },
            { question: "How many days are there in a leap year?", answer: "366" },
            { question: "What is the name of Harry Potter's owl?", answer: "Hedwig" },
            { question: "Which sport uses a bat and a ball and is played on a pitch?", answer: "Cricket" },
            { question: "What does a thermometer measure?", answer: "Temperature" },
            { question: "What planet do we live on?", answer: "Earth" },
            { question: "What is the tallest land animal?", answer: "Giraffe" },
            { question: "What is the largest internal organ in the human body?", answer: "Liver" }
        ]
    }
};

// Constants and variables
const STORAGE_KEY = 'flashcards_data';
let selectedCategories = [];
let currentCards = [];
let currentCardIndex = 0;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
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
    const shuffleBtn = document.getElementById('shuffleBtn');
    const newCardBtn = document.getElementById('newCardBtn');
    const modal = document.getElementById('newCardModal');
    const categorySelect = document.getElementById('categorySelect');
    const saveCardBtn = document.getElementById('saveCardBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importInput = document.getElementById('importInput');
    const resetBtn = document.getElementById('resetBtn');

    // Set up event listeners
    categoryToggle.addEventListener('click', toggleCategories);
    card.addEventListener('click', flipCard);
    prevBtn.addEventListener('click', showPreviousCard);
    nextBtn.addEventListener('click', showNextCard);
    shuffleBtn.addEventListener('click', performShuffle);
    newCardBtn.addEventListener('click', showAddCardModal);
    closeModalBtn.addEventListener('click', hideModal);
    saveCardBtn.addEventListener('click', saveNewCard);
    exportBtn.addEventListener('click', exportCards);
    importBtn.addEventListener('click', function() { importInput.click(); });
    importInput.addEventListener('change', importCards);
    resetBtn.addEventListener('click', resetStorage);

    // Load saved cards and initialize the UI
    loadCardsFromStorage();
    createCategoryCheckboxes();
    
    // Select the first category by default
    const firstCheckbox = document.querySelector('.checkbox-container input');
    if (firstCheckbox) {
        firstCheckbox.checked = true;
        updateSelectedCategories();
    }

    // Functions
    function toggleCategories() {
        categorySection.classList.toggle('open');
        categoryToggle.classList.toggle('active');
    }

    function flipCard() {
        card.classList.toggle('flipped');
    }

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
        currentCards = [];
        selectedCategories.forEach(category => {
            cardCategories[category].questions.forEach(q => {
                currentCards.push({
                    ...q,
                    category
                });
            });
        });
        
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
        if (currentCards.length <= 1) {
            return; // Nothing to shuffle
        }
        
        if (currentCardIndex >= currentCards.length - 1) {
            return; // Already at the end
        }
        
        // Keep already viewed cards (excluding current card)
        const viewedCards = currentCards.slice(0, currentCardIndex);
        
        // Take current card and remaining cards to shuffle together
        const cardsToShuffle = currentCards.slice(currentCardIndex);
        
        // Shuffle the current and remaining cards
        shuffleArray(cardsToShuffle);
        
        // Combine arrays: viewed cards + shuffled (current and remaining) cards
        currentCards = [...viewedCards, ...cardsToShuffle];
        
        updateCard();
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function showAddCardModal() {
        initializeCategorySelect();
        modal.style.display = 'block';
    }

    function hideModal() {
        modal.style.display = 'none';
    }

    function initializeCategorySelect() {
        categorySelect.innerHTML = '';
        Object.keys(cardCategories).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categorySelect.appendChild(option);
        });
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

    function loadCardsFromStorage() {
        const savedCards = localStorage.getItem(STORAGE_KEY);
        if (savedCards) {
            try {
                const parsedCards = JSON.parse(savedCards);
                Object.keys(parsedCards).forEach(category => {
                    if (cardCategories[category]) {
                        cardCategories[category].questions = parsedCards[category].questions;
                    } else {
                        cardCategories[category] = parsedCards[category];
                    }
                });
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
                    Object.keys(importedCards).forEach(category => {
                        if (cardCategories[category]) {
                            cardCategories[category].questions = importedCards[category].questions;
                        } else {
                            cardCategories[category] = importedCards[category];
                        }
                    });
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

    function resetStorage() {
        if (confirm('Are you sure you want to reset all cards? This will remove all custom cards and return to default settings.')) {
            // Clear local storage
            localStorage.removeItem(STORAGE_KEY);
            
            // Restore default cards
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
            Maths: {
        colour: '#e3f2fd', // Light blue
        questions: [
            { question: "What is the value of π (to 2 decimal places)?", answer: "3.14" },
            { question: "What is 12 squared?", answer: "144" },
            { question: "What is the mode in a set of numbers?", answer: "The most frequent number" },
            { question: "Solve: 3x = 12. What is x?", answer: "4" },
            { question: "What is 25% of 80?", answer: "20" },
            { question: "How many degrees in a right angle?", answer: "90" },
            { question: "What is the perimeter of a rectangle with sides 4cm and 6cm?", answer: "20cm" },
            { question: "What is 0.75 as a fraction?", answer: "3/4" },
            { question: "What is the formula for the area of a triangle?", answer: "½ × base × height" },
            { question: "What is 3³ (3 to the power of 3)?", answer: "27" }
        ]
    },
    Science: {
        colour: '#f1f8e9', // Light green
        questions: [
            { question: "What force pulls objects towards Earth?", answer: "Gravity" },
            { question: "What gas do we breathe in from the air?", answer: "Oxygen" },
            { question: "What part of the cell controls activities?", answer: "Nucleus" },
            { question: "What is H₂O?", answer: "Water" },
            { question: "What is the centre of an atom called?", answer: "Nucleus" },
            { question: "Name the three states of matter.", answer: "Solid, liquid, gas" },
            { question: "What happens to water when it boils?", answer: "Turns into steam/gas" },
            { question: "What is photosynthesis?", answer: "Plants making food using sunlight" },
            { question: "What organ pumps blood around the body?", answer: "Heart" },
            { question: "What is the chemical symbol for Iron?", answer: "Fe" }
        ]
    },
    Geography: {
        colour: '#fff3e0', // Light orange
        questions: [
            { question: "What is the capital of France?", answer: "Paris" },
            { question: "Name a continent that starts with 'A'.", answer: "Africa, Asia, Antarctica, Australia" },
            { question: "What is the longest river in the world?", answer: "The Nile" },
            { question: "Which ocean is the largest?", answer: "Pacific Ocean" },
            { question: "What country is famous for pyramids?", answer: "Egypt" },
            { question: "What do we call the lines that run east to west on a map?", answer: "Latitude" },
            { question: "What natural disaster is measured using the Richter scale?", answer: "Earthquake" },
            { question: "Which country has the most people?", answer: "China" },
            { question: "What is the UK’s highest mountain?", answer: "Ben Nevis" },
            { question: "What is a rainforest?", answer: "A dense forest with high rainfall" }
        ]
    },
    English: {
        colour: '#ede7f6', // Light purple
        questions: [
            { question: "What is a noun?", answer: "A person, place, or thing" },
            { question: "What is a verb?", answer: "An action word" },
            { question: "What is an adjective?", answer: "A word that describes a noun" },
            { question: "What is a synonym for 'happy'?", answer: "Joyful, cheerful, glad" },
            { question: "What is a metaphor?", answer: "A comparison without using 'like' or 'as'" },
            { question: "What does 'foreshadowing' mean in literature?", answer: "Hinting at future events" },
            { question: "What is the past tense of 'run'?", answer: "Ran" },
            { question: "Name a Shakespeare play.", answer: "Romeo and Juliet, Macbeth, Hamlet, etc." },
            { question: "What is the plural of 'mouse'?", answer: "Mice" },
            { question: "What punctuation ends a question?", answer: "Question mark (?)" }
        ]
    },
    General: {
        colour: '#ffebee', // Light red
        questions: [
            { question: "What is the opposite of day?", answer: "Night" },
            { question: "What colour do you get when you mix red and blue?", answer: "Purple" },
            { question: "What is the freezing point of water (°C)?", answer: "0°C" },
            { question: "How many days are there in a leap year?", answer: "366" },
            { question: "What is the name of Harry Potter's owl?", answer: "Hedwig" },
            { question: "Which sport uses a bat and a ball and is played on a pitch?", answer: "Cricket" },
            { question: "What does a thermometer measure?", answer: "Temperature" },
            { question: "What planet do we live on?", answer: "Earth" },
            { question: "What is the tallest land animal?", answer: "Giraffe" },
            { question: "What is the largest internal organ in the human body?", answer: "Liver" }
        ]
    }
        };
        
        // Reset to default cards
        Object.keys(defaultCards).forEach(category => {
            cardCategories[category] = {
                colour: defaultCards[category].colour,
                questions: [...defaultCards[category].questions]
            };
        });
    }
}); 