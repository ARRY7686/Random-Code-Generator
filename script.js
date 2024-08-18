let adviceCategories = {};
let typingTimeout;
let isDataFetched = false;
let currentAdvice = ''; // To keep track of the current advice being displayed

async function fetchAdviceData() {
    try {
        const response = await fetch('advices.json'); // Ensure the correct path to your JSON file
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        adviceCategories = data.categories; // Directly access the categories object
        console.log('Advice data fetched:', adviceCategories); // Debugging log
        isDataFetched = true;
        enableButtons(); // Enable buttons once data is fetched
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        displayAdvice('General', 'Error: Unable to fetch advice data.');
    }
}

function getRandomAdvice(category) {
    if (!isDataFetched) {
        console.log('Data not fetched yet');
        return 'Please wait, data is still being fetched.';
    }
    const categoryArray = adviceCategories[category] || adviceCategories.General; // Default to 'General' category
    const randomIndex = Math.floor(Math.random() * categoryArray.length);
    return categoryArray[randomIndex];
}

function typeAdvice(text, element) {
    let index = 0;
    const speed = 50; // Typing speed in milliseconds
    clearTimeout(typingTimeout); // Clear any ongoing typing animation

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            typingTimeout = setTimeout(type, speed);
            element.innerHTML += "<span id=\"cursor\"></span>";
        }
    }
    type();
}

function displayAdvice(category, adviceText = '') {
    const adviceContainer = document.getElementById('adviceContainerText');
    currentAdvice = adviceText || getRandomAdvice(category);
    // Clear previous advice and apply typing effect
    adviceContainer.innerHTML = ''; // Clear previous content
    typeAdvice(currentAdvice, adviceContainer);

    // Read the advice aloud
    readAloud(currentAdvice);
}

function setInitialMessage() {
    const welcomeText = "Welcome to Sage Swipe! Ready to receive some inspiration? Choose a category to get started!";
    const adviceContainer = document.getElementById('adviceContainerText');

    // Clear previous content and apply typing effect
    adviceContainer.innerHTML = ''; // Clear previous content
    typeAdvice(welcomeText, adviceContainer);
}

function enableButtons() {
    document.getElementById('btnMotivation').disabled = false;
    document.getElementById('btnProductivity').disabled = false;
    document.getElementById('btnGeneral').disabled = false;
}

function disableButtons() {
    document.getElementById('btnMotivation').disabled = true;
    document.getElementById('btnProductivity').disabled = true;
    document.getElementById('btnGeneral').disabled = true;
}

// Function to read the given text aloud
function readAloud(text) {
    if (window.speechSynthesis) {
        // Cancel any ongoing speech synthesis
        window.speechSynthesis.cancel();

        // Create a new SpeechSynthesisUtterance for the given text
        if (text) {
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        } else {
            console.log('No text available to read aloud.');
        }
    } else {
        console.log('Speech Synthesis API is not supported.');
    }
}

// Set up event listeners for buttons
document.getElementById('btnMotivation').addEventListener('click', () => displayAdvice('Motivation'));
document.getElementById('btnProductivity').addEventListener('click', () => displayAdvice('Productivity'));
document.getElementById('btnGeneral').addEventListener('click', () => displayAdvice('General'));

// Initial setup
disableButtons(); // Disable buttons initially
fetchAdviceData().then(() => {
    setInitialMessage();
});
