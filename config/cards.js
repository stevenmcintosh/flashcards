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
