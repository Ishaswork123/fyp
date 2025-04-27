let currentQuestion = 0;
let totalQuestions = 0;
let quizData = [];
const quizForm = document.getElementById('quizForm');
const quizQuestionsContainer = document.getElementById('quizQuestionsContainer');
const quizSubmitButton = document.getElementById('quizSubmitButton');
const questionNumberForm = document.getElementById('questionNumberForm');
const expTitleInput = document.getElementById('exp_title');
const expNoSelect = document.getElementById('exp_no');
const accessSelect = document.getElementById('access');
const classField = document.getElementById('classField');
const totalQuestionsInput = document.getElementById('total_questions');
const validationAlert = document.getElementById('validationAlert');

accessSelect.addEventListener('change', function() {
    classField.style.display = this.value === 'class' ? 'block' : 'none';
});

function updateTitle() {
    const selectedOption = expNoSelect.options[expNoSelect.selectedIndex];
    expTitleInput.value = selectedOption.text.split(' - ')[1] || '';
}

function validateTotalQuestions(input) {
    if (input.value < 0) {
        input.value = 0;
    } else if (input.value > 10) {
        input.value = 10;
    }
}

function startQuizCreation() {
    totalQuestions = parseInt(totalQuestionsInput.value);
    if (isNaN(totalQuestions) || totalQuestions <= 0) {
        alert('Please enter a valid number of questions.');
        return;
    }
    quizData = Array(totalQuestions).fill(null).map(() => ({})); // Initialize quizData
    currentQuestion = 1;
    questionNumberForm.style.display = 'none';
    quizForm.style.display = 'block';
    renderQuestion();
}

function renderQuestion() {
    quizQuestionsContainer.innerHTML = '';
    const exp_title = expTitleInput.value;
    const form = document.createElement('div');
    form.id = `question-${currentQuestion}`;

    const questionData = quizData[currentQuestion - 1] || {};

    form.innerHTML += `
        <h3>${exp_title} Quiz Question No${currentQuestion}</h3>
        <label for="question${currentQuestion}">Question:</label>
        <input type="text" id="question${currentQuestion}" name="question${currentQuestion}" value="${questionData.question || ''}" required><br>

        <label for="option1${currentQuestion}">Option A:</label>
        <input type="text" id="option1${currentQuestion}" name="option1${currentQuestion}" value="${questionData.option1 || ''}" onblur="addPrefix(this, 'A')" required><br>

        <label for="option2${currentQuestion}">Option B:</label>
        <input type="text" id="option2${currentQuestion}" name="option2${currentQuestion}" value="${questionData.option2 || ''}" onblur="addPrefix(this, 'B')" required><br>

        <label for="option3${currentQuestion}">Option C:</label>
        <input type="text" id="option3${currentQuestion}" name="option3${currentQuestion}" value="${questionData.option3 || ''}" onblur="addPrefix(this, 'C')" required><br>

        <label for="option4${currentQuestion}">Option D:</label>
        <input type="text" id="option4${currentQuestion}" name="option4${currentQuestion}" value="${questionData.option4 || ''}" onblur="addPrefix(this, 'D')" required><br>

        <label for="answer${currentQuestion}">Correct Answer (A, B, C, or D):</label>
        <input type="text" id="answer${currentQuestion}" name="answer${currentQuestion}"
            onfocus="clearAlert()"
            onblur="validateAndAutoPrefixAnswer(this)"
            value="${questionData.answer || ''}"
            required><br>
    `;

    quizQuestionsContainer.appendChild(form);

    // Update button visibility
    if (totalQuestions > 1) {
        quizSubmitButton.style.display = 'flex';
        const previousButton = quizSubmitButton.querySelector('button[onclick="previousQuestion()"]');
        if (previousButton) {
            previousButton.style.display = currentQuestion > 1 ? 'inline-block' : 'none';
        }
    } else {
        quizSubmitButton.style.display = 'block';
        const previousButton = quizSubmitButton.querySelector('button[onclick="previousQuestion()"]');
        if (previousButton) {
            previousButton.style.display = 'none';
        }
    }

    const nextButton = quizSubmitButton.querySelector('button[onclick="nextQuestion()"]');
    const submitButton = quizSubmitButton.querySelector('button[type="submit"]');

    if (currentQuestion < totalQuestions) {
        if (nextButton) {
            nextButton.style.display = 'inline-block';
        }
        if (submitButton) {
            submitButton.style.display = 'none';
        }
    } else {
        if (nextButton) {
            nextButton.style.display = 'none';
        }
        if (submitButton) {
            submitButton.style.display = 'inline-block';
        }
    }
}

function nextQuestion() {
    // Save current question data
    saveCurrentQuestionData();
    if (currentQuestion < totalQuestions) {
        currentQuestion++;
        renderQuestion();
    }
}

function previousQuestion() {
    saveCurrentQuestionData();
    if (currentQuestion > 1) {
        currentQuestion--;
        renderQuestion();
    }
}

function saveCurrentQuestionData() {
    const questionIndex = currentQuestion - 1;
    quizData[questionIndex] = {
        question: document.getElementById(`question${currentQuestion}`).value,
        option1: document.getElementById(`option1${currentQuestion}`).value,
        option2: document.getElementById(`option2${currentQuestion}`).value,
        option3: document.getElementById(`option3${currentQuestion}`).value,
        option4: document.getElementById(`option4${currentQuestion}`).value,
        answer: document.getElementById(`answer${currentQuestion}`).value.toUpperCase()
    };
}

function validateQuizForm() {
    validationAlert.textContent = '';
    saveCurrentQuestionData(); // Ensure the last question's data is saved

    for (let i = 0; i < totalQuestions; i++) {
        const questionData = quizData[i];
        if (!questionData.question || !questionData.option1 || !questionData.option2 || !questionData.option3 || !questionData.option4 || !questionData.answer) {
            validationAlert.textContent = `Please fill in all fields for question ${i + 1}.`;
            currentQuestion = i + 1;
            renderQuestion();
            return false;
        }
        if (!['A', 'B', 'C', 'D'].includes(questionData.answer)) {
            validationAlert.textContent = `Invalid answer format for question ${i + 1}. Please use A, B, C, or D.`;
            currentQuestion = i + 1;
            renderQuestion();
            return false;
        }
    }

    // If all validations pass, the form will submit
    return true;
}

function addPrefix(inputElement, prefix) {
    if (!inputElement.value.startsWith(prefix + ". ")) {
        inputElement.value = prefix + ". " + inputElement.value;
    }
}

function validateAndAutoPrefixAnswer(answerInput) {
    const value = answerInput.value.trim().toUpperCase();
    if (value !== 'A' && value !== 'B' && value !== 'C' && value !== 'D') {
        alert('Please enter the correct option (A, B, C, or D).');
        answerInput.value = ''; // Clear the invalid input
    }
}

function clearAlert() {
    validationAlert.textContent = '';
}