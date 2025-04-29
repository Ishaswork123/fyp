// class ValidationError extends Error {
//     constructor(message) {
//       super(message);
//       this.name = 'ValidationError';
//     }
//   }
//   function handleValidation(fn) {
//     try {
//       fn();
//     } catch (error) {
//       if (error instanceof ValidationError) {
//         console.error('Validation Error:', error.message);
//         alert(error.message);
//       } else {
//         console.error('Unknown Error:', error.message);
//       }
//     }
//   }
    









let currentQuestion = 1;
let totalQuestions = 0;
let quizData = JSON.parse(localStorage.getItem('quizData')) || [];;
let experimentNo;
let experimentTitle;
let exp_no;
let exp_title;
let totalQuestion_1;
let assignedTo;
let classId='';
let count=0
window.onload = function () {
    document.getElementById('questionModal').style.display = 'block';
};

function startQuizCreation() {
    experimentNo = document.getElementById("exp_no").value;
    experimentTitle = document.getElementById("exp_title").value;
    const totalQuestionsInput = document.getElementById("total_questions").value;
    assignedTo=document.getElementById('access').value;
    classId=document.getElementById('classId').value;
    console.log("Experiment No:", experimentNo);
    console.log("Experiment Title:", experimentTitle);
    console.log("Total Questions:", totalQuestionsInput);
    console.log("assigned to:", assignedTo);
    console.log("class Id :", classId);
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
}function showQuestionForm() {
  const form = document.getElementById('quizQuestionForm');
  form.innerHTML = ''; // Clear previous content

  if (currentQuestion <= totalQuestions) {
      const savedData = JSON.parse(localStorage.getItem('quizData')) || [];
      const questionData = savedData[currentQuestion - 1] || {};

      form.innerHTML += `
          <h3>${exp_title} Quiz Question No${currentQuestion}</h3>

          <label for="question">Question:</label>
          <input type="text" id="question" name="question${currentQuestion}" value="${questionData.question || ''}" required><br>

          <!-- Options with pre-filled values -->
          <label for="option1">Option A:</label>
          <input type="text" id="option1" name="option1${currentQuestion}" value="${questionData.option1 || ''}" onblur="addPrefix(this, 'A')" ;required><br>

          <label for="option2">Option B:</label>
          <input type="text" id="option2" name="option2${currentQuestion}" value="${questionData.option2 || ''}" onblur="addPrefix(this, 'B')"; required><br>

          <label for="option3">Option C:</label>
          <input type="text" id="option3" name="option3${currentQuestion}" value="${questionData.option3 || ''}" onblur="addPrefix(this, 'C')" ; required><br>

          <label for="option4">Option D:</label>
          <input type="text" id="option4" name="option4${currentQuestion}" value="${questionData.option4 || ''}" onblur="addPrefix(this, 'D')" ;  required><br>
<label for="answer">Correct Answer:</label>
<select id="answer${currentQuestion}" name="answer${currentQuestion}" class="answer-select" required>
  <option value="">--Select Correct Option--</option>
  <option value="A"></option>
  <option value="B"></option>
  <option value="C"></option>
  <option value="D"></option>
</select><br>



<!-- Checkbox (aligned to left) -->
<div style="display: flex; align-items: center; width: 100%; max-width: 500px; margin-bottom: 10px;">
    <input type="checkbox" id="acceptTerms${currentQuestion}" 
           onclick="validateCurrentQuestion(); validateAndAutoPrefixAnswer(document.getElementById('answer'));" 
           style="margin: 0 8px 0 0; height: 16px; width: 16px; cursor: pointer;"
           required>
    <label for="acceptTerms${currentQuestion}" style="font-size: 14px; line-height: 1.4; color: #fff; cursor: pointer;">
        I accept the Terms and Conditions of validation before moving to the next
    </label>
</div>



          <div class="button-container">
              ${currentQuestion > 1 ? `<button type="button" class="horizontal-button" onclick="previousQuestion()">Previous</button>` : ''}
              <button type="submit" class="horizontal-button" onclick="nextQuestion()">Next</button>
          </div>
      `;
  } else {
      form.innerHTML += `
          <h3>All questions have been entered.</h3>
          <button type="button" class="horizontal-button" onclick="submitQuizForm()">Submit Quiz</button>
          ${currentQuestion > 1 ? `<button type="button" class="horizontal-button" onclick="previousQuestion()">Previous</button>` : ""}
      `;
  }
}





// function validateAndAutoPrefixAnswer(input) {
//     const answer = input.value.trim().toLowerCase();
  
//     const options = [
//       document.getElementById("option1").value.trim(),
//       document.getElementById("option2").value.trim(),
//       document.getElementById("option3").value.trim(),
//       document.getElementById("option4").value.trim()
//     ];
  
//     const labels = ["A", "B", "C", "D"];
//     let matched = false;
  
//     for (let i = 0; i < options.length; i++) {
//       const optionText = options[i].toLowerCase().replace(/^[a-d]:\s*/i, '');
//       const answerText = answer.replace(/^[a-d]:\s*/i, '');
  
//       if (answerText === optionText) {
//         input.value = `${labels[i]}: ${optionText}`;
//         matched = true;
//         break;
//       }
//     }
  
//     if (!matched) {
//       throw new ValidationError("❌ Answer does not match any of the provided options.");
//     }
//   }
//   function findDuplicateOption() {
//     const options = [
//       document.getElementById("option1").value.trim().toLowerCase(),
//       document.getElementById("option2").value.trim().toLowerCase(),
//       document.getElementById("option3").value.trim().toLowerCase(),
//       document.getElementById("option4").value.trim().toLowerCase()
//     ];
  
//     const uniqueOptions = new Set();
  
//     for (let option of options) {
//       if (uniqueOptions.has(option)) {
//         throw new ValidationError("❌ Duplicate option found!");
//       }
//       uniqueOptions.add(option);
//     }
//   }

// function validateQuestionAndAnswer() {
//     if (!validateCurrentQuestion()) {
//         return; // Stop if options are invalid
//     }
//     validateAndAutoPrefixAnswer(document.getElementById('answer'));
// }

function validateAndAutoPrefixAnswer(input) {
    const answer = input.value.trim().toLowerCase();

    const options = [
        document.getElementById("option1").value.trim().toLowerCase(),
        document.getElementById("option2").value.trim().toLowerCase(),
        document.getElementById("option3").value.trim().toLowerCase(),
        document.getElementById("option4").value.trim().toLowerCase()
    ];
    console.log('Options during answer validation:', options);

    const labels = ["A", "B", "C", "D"];
    let matched = false;

    for (let i = 0; i < options.length; i++) {
        const parts = options[i].split(':');
        const optionText = parts.length > 1 ? parts.slice(1).join(':').trim().toLowerCase() : options[i].trim();

        if (answer === optionText) {
            input.value = `${labels[i]}: ${optionText}`;
            matched = true;
            break;
        }
    }

    if (!matched) {
        alert("❌ Answer does not match any of the provided options.");
        input.value = ""; // Clear wrong input
        input.focus();    // Focus again
    }
}

// function validateAndAutoPrefixAnswer(input) {
//     const answer = input.value.trim().toLowerCase();

//     const options = [
//         document.getElementById("option1").value.trim().toLowerCase(),
//         document.getElementById("option2").value.trim().toLowerCase(),
//         document.getElementById("option3").value.trim().toLowerCase(),
//         document.getElementById("option4").value.trim().toLowerCase()
//     ];
//     console.log('Options during answer validation:', options);

//     const labels = ["A", "B", "C", "D"];
//     let matched = false;

//     for (let i = 0; i < options.length; i++) {
//         const parts = options[i].split(':');
//         const optionText = parts.length > 1 ? parts.slice(1).join(':').trim().toLowerCase() : options[i].trim();

//         if (answer === optionText) {
//             input.value = `${labels[i]}: ${optionText}`;
//             matched = true;
//             break;
//         }
//     }

//     if (!matched) {
//         alert("❌ Answer does not match any of the provided options.");
//         input.value = ""; // Clear wrong input
//         input.focus();    // Focus again
//     }
// }
// Add prefix like "A: " automatically if not already present

// Add event listeners when the page loads
document.addEventListener("DOMContentLoaded", () => {
    // Add input event listeners to all option fields
    document.getElementById("option1").addEventListener("input", updateOptionLabels)
    document.getElementById("option2").addEventListener("input", updateOptionLabels)
    document.getElementById("option3").addEventListener("input", updateOptionLabels)
    document.getElementById("option4").addEventListener("input", updateOptionLabels)
  
    // Initial update of the dropdown
    updateOptionLabels()
  })
  
  // Function to add prefix to option text (A, B, C, D)
  function addPrefix(inputElement, prefix) {
    const value = inputElement.value
    if (value && !value.startsWith(`${prefix}. `)) {
      inputElement.value = `${prefix}. ${value}`
    }
    // Update dropdown after adding prefix
    updateOptionLabels()
  }
  
  // Function to update the dropdown options based on input values
  function updateOptionLabels() {
    // Get all option input values
    const option1Value = document.getElementById("option1").value
    const option2Value = document.getElementById("option2").value
    const option3Value = document.getElementById("option3").value
    const option4Value = document.getElementById("option4").value
  
    // Get the select element
    const select = document.getElementById(`answer${currentQuestion}`)
  
    // Update each option in the dropdown
    select.options[1].text = option1Value ? `A. ${option1Value.replace(/^A\.\s*/, "")}` : "A"
    select.options[2].text = option2Value ? `B. ${option2Value.replace(/^B\.\s*/, "")}` : "B"
    select.options[3].text = option3Value ? `C. ${option3Value.replace(/^C\.\s*/, "")}` : "C"
    select.options[4].text = option4Value ? `D. ${option4Value.replace(/^D\.\s*/, "")}` : "D"
  
    console.log("Updated dropdown options")
  }
  

// //   // Prevent duplicate options
// //   const optionInputs = ["option1", "option2", "option3", "option4"];
// //   optionInputs.forEach(id => {
// //     const el = document.getElementById(id);
// //     el.addEventListener('blur', () => {
// //       const values = optionInputs.map(optId => document.getElementById(optId).value.trim().toLowerCase());
// //       const duplicates = values.filter((v, i, arr) => v && arr.indexOf(v) !== i);
// //       if (duplicates.length > 0) {
// //         alert("Each option must be unique. Duplicate found.");
// //         el.focus();
// //       }
// //     });
// //   });
function saveCurrentQuestionData() {
    console.log('save current question called ');
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

    // Save the current question data to the quizData array and also in localStorage
    quizData[currentQuestion - 1] = { question, option1, option2, option3, option4, answer };
    localStorage.setItem('quizData', JSON.stringify(quizData)); // Saving to localStorage
}


function nextQuestion() {
    const checkbox = document.getElementById(`acceptTerms${currentQuestion}`);

    if (count > 0) {
        alert("❌ Please correct the current question before moving to the next one.");
        return; // Block moving forward
    }

    if (!checkbox.checked) {
        alert("❌ Please accept the Terms and Conditions before proceeding.");
        return; // Block moving forward
    }

    // Save current question data before proceeding
    saveCurrentQuestionData();

    // Move to next
    currentQuestion++;
    showQuestionForm();
}


function previousQuestion() {
    if (currentQuestion > 1) {
        saveCurrentQuestionData(); // Save the current question data before moving back
        currentQuestion--; 
        showQuestionForm(); // Show the form for the previous question
    }
}function validateCurrentQuestion() {
    count = 0; // Reset count initially

    const question = document.getElementById('question').value.trim();
    const options = [
        document.getElementById('option1').value.trim(),
        document.getElementById('option2').value.trim(),
        document.getElementById('option3').value.trim(),
        document.getElementById('option4').value.trim()
    ];
    const answer = document.getElementById('answer').value.trim();

    // Check if all fields are filled
    if (!question || options.some(opt => !opt) || !answer) {
        alert('Please fill out all fields before proceeding.');
        count++;
        return false;
    }

    // Validate option format (must start with A)- or A: or 1)- or 1: )
    // const format = /^([A-Da-d]\)|[A-Da-d]:|\d\)|\d:)\s.+$/;
    // for (const option of options) {
    //     if (!format.test(option)) {
    //         alert(`Option "${option}" is invalid. Use the format "A: Answer", "A) Answer", "1: Answer", or "1) Answer".`);
    //         count++;
    //         return false;
    //     }
    // }

    // Clean option text (remove prefixes like 'A:', '1)', etc.)
    const cleanedOptions = options.map(option => {
        const parts = option.split(':'); 
        return parts.length > 1 ? parts.slice(1).join(':').trim() : option.trim();
    });

    // Validate no duplicate options
    for (let i = 0; i < cleanedOptions.length; i++) {
        for (let j = i + 1; j < cleanedOptions.length; j++) {
            if (cleanedOptions[i] === cleanedOptions[j]) {
                alert(`Duplicate option found: "${options[i]}"`);
                count++;
                return false;
            }
        }
    }

    // Validate answer matches exactly one of the options
    // if (!options.includes(answer)) {
    //     alert('The correct answer must exactly match one of the provided options.');
    //     count++;
    //     return false;
    // }

    const optionPattern =/^[A-Za-z]{2,}$|^\d{1,}$|^[A-Za-z\s]{2,}$/;  // Allow alphabetic words with at least two characters, single digits, or sentences with at least two characters

    for (const option of options) {
        // Extract the content after "D:", "1:", etc.
        const content = option.split(':').slice(1).join(':').trim(); // Skip "D: ", "1: ", etc. and get the actual content
        
        // Validate the content based on the pattern
        if (!optionPattern.test(content)) {
        alert(`Option "${content}" is invalid. Options must be either:
        - A number (e.g., 1, 42)
        - A word with at least two letters (e.g., "ab", "word")
        - A sentence with at least two characters (e.g., "A sentence")
        
        Single letters like "a", "b", "k" are not allowed.`);
        checkbox.checked = false;
        count++;
        return false;
    }
    }
    
    const validAnswerPattern =  /^[A-Za-z]{2,}$|^\d{1,}$|^[A-Za-z\s]{2,}$/;  // Answer must be at least two characters (if alphabetic), a single digit, or a sentence

    // Validate the answer content
    if (!validAnswerPattern.test(answer)) {
        alert(`Answer "${answer}" is invalid. Answers must be either:
        - A number (e.g., 1, 42)
        - A word with at least two letters (e.g., "ab", "word")
        - A sentence with at least two characters (e.g., "A sentence")
        
        Single letters like "a", "b", "k" are not allowed.`);
        checkbox.checked = false;
        count++;
        return false;
    }
    

    // If all validations passed
    count = 0;
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


    // if (quizData.length !== totalQuestions || quizData.some(data => Object.values(data).some(value => !value))) {
    //     alert('Please ensure all questions are filled properly.');
    //     return;
    // }

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
        <input type="hidden" name="assignedTo" value="${assignedTo}">
        <input type="hidden" name="classId" value="${classId}">

    `;

    console.log('expno,exp-title,totalquestion,assignedTo,classId',exp_no,exp_title,totalQuestion_1,assignedTo,classId)
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
    localStorage.removeItem('quizData');
    alert('Quiz Submitted Successfully!');
    // currentQuestion = 1;
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