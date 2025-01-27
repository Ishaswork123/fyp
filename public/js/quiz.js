let currentQuestion = 1;
let totalQuestions = 0;
let quizData = [];
let experimentNo;
let experimentTitle;
let exp_no;
let exp_title;
let totalQuestion_1;
window.onload = function () {
    document.getElementById('questionModal').style.display = 'block';
};

function startQuizCreation() {
    experimentNo = document.getElementById("exp_no").value;
    experimentTitle = document.getElementById("exp_title").value;
    const totalQuestionsInput = document.getElementById("total_questions").value;
    console.log("Experiment No:", experimentNo);
    console.log("Experiment Title:", experimentTitle);
    console.log("Total Questions:", totalQuestionsInput);

    if (!experimentNo || !experimentTitle || isNaN(totalQuestionsInput)) {
        alert("Please fill out all required fields!");
        return;
    }
    totalQuestions = parseInt(totalQuestionsInput);

    // Copy data to hidden fields
//    exp_no= document.getElementById("hidden_exp_no");
//     exp_title=document.getElementById("hidden_exp_title");
//     //  = experimentTitle;
//     totalQuestion_1=document.getElementById("hidden_total_questions")
exp_no=experimentNo;
exp_title=experimentTitle;
totalQuestion_1=totalQuestions;
    document.getElementById('questionModal').style.display = 'none';
    document.getElementById('questionNumberForm').style.display = 'none';
    document.getElementById('quizForm').style.display = 'block';
    showQuestionForm();
}


function showQuestionForm() {
    const form = document.getElementById('quizQuestionForm');
    form.innerHTML = ''; // Clear previous content
    if (currentQuestion <= totalQuestions) {
        const savedData = JSON.parse(localStorage.getItem(`question${currentQuestion}`)) || {};

        form.innerHTML += `
            <h3>Question ${currentQuestion}</h3>
            <label for="question">Question:</label>
            <input type="text" id="question" name="question${currentQuestion}" value="${savedData.question || ''}" required><br>

            <label for="option1">Option 1:</label>
            <input type="text" id="option1" name="option1${currentQuestion}" value="${savedData.option1 || ''}" required><br>

            <label for="option2">Option 2:</label>
            <input type="text" id="option2" name="option2${currentQuestion}" value="${savedData.option2 || ''}" required><br>

            <label for="option3">Option 3:</label>
            <input type="text" id="option3" name="option3${currentQuestion}" value="${savedData.option3 || ''}" required><br>

            <label for="option4">Option 4:</label>
            <input type="text" id="option4" name="option4${currentQuestion}" value="${savedData.option4 || ''}" required><br>

            <label for="answer">Correct Answer:</label>
            <input type="text" id="answer" name="answer${currentQuestion}" value="${savedData.answer || ''}" required><br>


            <div class="button-container">
                ${currentQuestion > 1 ? `<button type="button" class="horizontal-button" onclick="previousQuestion()">Previous</button>` : ''}
                <button type="button" class="horizontal-button" onclick="nextQuestion()">Next</button>
            </div>
        `;
    } else {
        form.innerHTML += `
            <h3>All questions have been entered.</h3>
            <button type="button" class="horizontal-button" onclick="submitQuizForm()">Submit Quiz</button>
             ${currentQuestion > 1 ?  `<button type="button" class="horizontal-button" onclick="previousQuestion()">Previous</button>` : ""}

        `;
    }
}

function nextQuestion() {
    if (!validateCurrentQuestion()) return;
    saveCurrentQuestionData();
    currentQuestion++;
    showQuestionForm();
}

function previousQuestion() {
    if(currentQuestion>1)
    {
      saveCurrentQuestionData();
    currentQuestion--;
    showQuestionForm();
    }
    
}

function saveCurrentQuestionData() {
    const questionEl = document.getElementById('question');
    const option1El = document.getElementById('option1');
    const option2El = document.getElementById('option2');
    const option3El = document.getElementById('option3');
    const option4El = document.getElementById('option4');
    const answerEl = document.getElementById('answer');

    if (!questionEl || !option1El || !option2El || !option3El || !option4El || !answerEl) {
        console.warn('Some elements are missing. Cannot save data.');
        return;
    }

    const question = questionEl.value.trim();
    const option1 = option1El.value.trim();
    const option2 = option2El.value.trim();
    const option3 = option3El.value.trim();
    const option4 = option4El.value.trim();
    const answer = answerEl.value.trim();

    quizData[currentQuestion - 1] = {
        question,
        option1,
        option2,
        option3,
        option4,
        answer,
    };
    localStorage.setItem('quizData', JSON.stringify(quizData));

}

function validateCurrentQuestion() {
    const question = document.getElementById('question').value;
    const options = [
        document.getElementById('option1').value,
        document.getElementById('option2').value,
        document.getElementById('option3').value,
        document.getElementById('option4').value
    ];
    const answer = document.getElementById('answer').value;

    // Check if all fields are filled
    if (!question || options.some(opt => !opt) || !answer) {
        alert('Please fill out all fields before proceeding.');
        return false;
    }

    // Validate option format
    const format = /^([A-Da-d]\)|[A-Da-d]:|\d\)|\d:)\s.+$/;
    for (const option of options) {
        if (!format.test(option)) {
            alert(`Option "${option}" is invalid. Use the format "A: Answer", "A) Answer", "1: Answer", or "1) Answer".`);
            return false;
        }
    }

    // Validate correct answer exists in options
    if (!options.includes(answer)) {
        alert('The correct answer must match one of the provided options.');
        return false;
    }
    return true;
}

function submitQuizForm() {

    if(currentQuestion<=totalQuestions)
    {
        if(!validateCurrentQuestion()){return;}
        saveCurrentQuestionData();
    }
  

    console.log('quizData:', quizData);
    console.log('totalQuestions:', totalQuestions);


    if (quizData.length !== totalQuestions || quizData.some(data => Object.values(data).some(value => !value))) {
        alert('Please ensure all questions are filled properly.');
        return;
    }

    const form = document.getElementById('quizQuestionForm');
    if (!form) {
        alert('Form container is missing!');
        return;
    }

    // const expNo = document.getElementById('hidden_exp_no');
    // const expTitle = document.getElementById('hidden_exp_title');
    // const totalQuestionsInput = document.getElementById('hidden_total_questions');

    

    form.innerHTML = '';

    form.innerHTML += `
        <input type="hidden" name="exp_no" value="${exp_no}">
        <input type="hidden" name="exp_title" value="${exp_title}">
        <input type="hidden" name="total_questions" value="${totalQuestion_1}">
    `;
    if (!exp_no || !exp_title || ! totalQuestion_1) {
        alert('Missing experiment details! Please try again.');
        return;
    }

    quizData.forEach((data, index) => {
        form.innerHTML += `
            <input type="hidden" name="question${index + 1}" value="${data.question}">
            <input type="hidden" name="option1${index + 1}" value="${data.option1}">
            <input type="hidden" name="option2${index + 1}" value="${data.option2}">
            <input type="hidden" name="option3${index + 1}" value="${data.option3}">
            <input type="hidden" name="option4${index + 1}" value="${data.option4}">
            <input type="hidden" name="answer${index + 1}" value="${data.answer}">
        `;
    });

    form.submit();
}

function updateTitle() {
    const experimentNo = document.getElementById('exp_no').value;
    const titleInput = document.getElementById('exp_title');

    const titles = {
        1: 'Pendulum',
        2: 'Mass Spring System',
        3: 'Meter Rod Method',
        4: 'Force Table',
        5: 'Resonance Exp'
    }; titleInput.value = titles[experimentNo] || '';
}

document.addEventListener("DOMContentLoaded", function () {
    const formContainer = document.querySelector(".header_container");
    const secondForm = document.querySelector("#quizForm");

    if (secondForm) {
        secondForm.addEventListener("focus", function () {
            formContainer.classList.add("second-form-active");
        });

        secondForm.addEventListener("blur", function () {
            formContainer.classList.remove("second-form-active");
        });
    }
});