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
let quizData=[];
quizData = JSON.parse(localStorage.getItem('quizData')) || [];;
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
// Initialize the form when the document is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Load saved data from localStorage if available
    const savedData = localStorage.getItem("quizData")
    if (savedData) {
      quizData = JSON.parse(savedData)
    }
  
    // Set up option input event listeners
    setupOptionListeners()
  })

  
function setupOptionListeners() {
    const option1 = document.getElementById("option1")
    const option2 = document.getElementById("option2")
    const option3 = document.getElementById("option3")
    const option4 = document.getElementById("option4")
  
    if (option1) option1.addEventListener("input", updateOptionLabels)
    if (option2) option2.addEventListener("input", updateOptionLabels)
    if (option3) option3.addEventListener("input", updateOptionLabels)
    if (option4) option4.addEventListener("input", updateOptionLabels)
  
    // Initial update if all options exist
    if (option1 && option2 && option3 && option4) {
      updateOptionLabels()
    }
  }
  

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
}
function showQuestionForm() {
    const form = document.getElementById("quizQuestionForm")
    form.innerHTML = "" // Clear previous content
  
    if (currentQuestion <= totalQuestions) {
      // Get saved data for this question
      const questionData = quizData[currentQuestion - 1] || {}
  
      form.innerHTML += `
        <h3>${exp_title} Quiz Question No${currentQuestion}</h3>
  
        <label for="question">Question:</label>
        <input type="text" id="question" name="question${currentQuestion}" value="${questionData.question || ""}" required><br>
  
        <!-- Options with pre-filled values -->
        <label for="option1">Option A:</label>
        <input type="text" id="option1" name="option1${currentQuestion}" value="${questionData.option1 || ""}" required><br>
  
        <label for="option2">Option B:</label>
        <input type="text" id="option2" name="option2${currentQuestion}" value="${questionData.option2 || ""}" required><br>
  
        <label for="option3">Option C:</label>
        <input type="text" id="option3" name="option3${currentQuestion}" value="${questionData.option3 || ""}" required><br>
  
        <label for="option4">Option D:</label>
        <input type="text" id="option4" name="option4${currentQuestion}" value="${questionData.option4 || ""}" required><br>
  
        <label for="answer${currentQuestion}">Correct Answer:</label>
        <select id="answer${currentQuestion}" name="answer${currentQuestion}" class="answer-select" required>
          <option value="">--Select Correct Option--</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select><br>
  
        <!-- Checkbox (aligned to left) -->
        <div style="display: flex; align-items: center; width: 100%; max-width: 500px; margin-bottom: 10px;">
          <input type="checkbox" id="acceptTerms${currentQuestion}" 
                 onclick="validateCurrentQuestion();" 
                 style="margin: 0 8px 0 0; height: 16px; width: 16px; cursor: pointer;"
                 required>
          <label for="acceptTerms${currentQuestion}" style="font-size: 14px; line-height: 1.4; color: #fff; cursor: pointer;">
            I accept the Terms and Conditions of validation before moving to the next
          </label>
        </div>
  
        <div class="button-container">
          ${currentQuestion > 1 ? `<button type="button" class="horizontal-button" onclick="previousQuestion()">Previous</button>` : ""}
          <button type="button" class="horizontal-button" onclick="nextQuestion()">Next</button>
        </div>
      `
  
      // Set up event listeners after creating the form
      setupOptionListeners()
  
      // Add blur event listeners to add prefixes
      const option1El = document.getElementById("option1")
      const option2El = document.getElementById("option2")
      const option3El = document.getElementById("option3")
      const option4El = document.getElementById("option4")
  
      if (option1El) option1El.addEventListener("blur", () => addPrefix(option1El, "A"))
      if (option2El) option2El.addEventListener("blur", () => addPrefix(option2El, "B"))
      if (option3El) option3El.addEventListener("blur", () => addPrefix(option3El, "C"))
      if (option4El) option4El.addEventListener("blur", () => addPrefix(option4El, "D"))
  
      // Update dropdown options with option text
      updateOptionLabels()
  
      // Set the previously selected answer if it exists
      if (questionData.answer) {
        const answerSelect = document.getElementById(`answer${currentQuestion}`)
        if (answerSelect) {
          answerSelect.value = questionData.answer
        }
      }
    } else {
      form.innerHTML += `
        <h3>All questions have been entered.</h3>
        <button type="button" class="horizontal-button" onclick="submitQuizForm()">Submit Quiz</button>
        ${currentQuestion > 1 ? `<button type="button" class="horizontal-button" onclick="previousQuestion()">Previous</button>` : ""}
      `
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

// function validateAndAutoPrefixAnswer(input) {
//     const answerElement = document.getElementById(`answer${currentQuestion}`);
//     if (!answerElement) {
//       console.warn(`Answer input with id="answer${currentQuestion}" not found`);
//       return;
//     }
    
//     const answer = answerElement.value.trim();
    
  
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
// document.addEventListener("DOMContentLoaded", () => {
//   const option1 = document.getElementById("option1")
//   const option2 = document.getElementById("option2")
//   const option3 = document.getElementById("option3")
//   const option4 = document.getElementById("option4")

//   if (option1) option1.addEventListener("input", updateOptionLabels)
//   if (option2) option2.addEventListener("input", updateOptionLabels)
//   if (option3) option3.addEventListener("input", updateOptionLabels)
//   if (option4) option4.addEventListener("input", updateOptionLabels)

//   // Initial update if all options exist
//   if (option1 && option2 && option3 && option4) {
//     updateOptionLabels()
//   }
// })


function addPrefix(inputElement, prefix) {
    if (!inputElement) return
  
    const value = inputElement.value.trim()
    if (!value) return
  
    // Check if already has prefix
    if (!value.startsWith(`${prefix}. `)) {
      // Remove any existing prefix pattern like "A. ", "B. ", etc.
      const cleanValue = value.replace(/^[A-D]\.\s+/, "")
      inputElement.value = `${prefix}. ${cleanValue}`
    }
  
    // Update dropdown after adding prefix
    updateOptionLabels()
  }
  // Function to update the dropdown options based on input values
 // Function to update the dropdown options based on input values
function updateOptionLabels() {
    const option1El = document.getElementById("option1")
    const option2El = document.getElementById("option2")
    const option3El = document.getElementById("option3")
    const option4El = document.getElementById("option4")
    const answerSelect = document.getElementById(`answer${currentQuestion}`)
  
    if (!option1El || !option2El || !option3El || !option4El || !answerSelect) return
  
    // Get all option input values
    const option1Value = option1El.value.trim()
    const option2Value = option2El.value.trim()
    const option3Value = option3El.value.trim()
    const option4Value = option4El.value.trim()
  
    // Extract clean option text (without prefixes)
    const cleanOption1 = option1Value.replace(/^A\.\s*/, "")
    const cleanOption2 = option2Value.replace(/^B\.\s*/, "")
    const cleanOption3 = option3Value.replace(/^C\.\s*/, "")
    const cleanOption4 = option4Value.replace(/^D\.\s*/, "")
  
    // Store the currently selected value
    const currentSelectedValue = answerSelect.value
  
    // Update each option in the dropdown with full option text
    answerSelect.options[1].text = cleanOption1 ? `A. ${cleanOption1}` : "A"
    answerSelect.options[2].text = cleanOption2 ? `B. ${cleanOption2}` : "B"
    answerSelect.options[3].text = cleanOption3 ? `C. ${cleanOption3}` : "C"
    answerSelect.options[4].text = cleanOption4 ? `D. ${cleanOption4}` : "D"
  
    // Restore the selected value
    answerSelect.value = currentSelectedValue
  
    console.log("Updated dropdown options with full option text")
  }
  
  
function saveCurrentQuestionData() {
    console.log("Saving current question data...")
  
    const questionEl = document.getElementById("question")
    const option1El = document.getElementById("option1")
    const option2El = document.getElementById("option2")
    const option3El = document.getElementById("option3")
    const option4El = document.getElementById("option4")
    const answerEl = document.getElementById(`answer${currentQuestion}`)
  
    if (!questionEl || !option1El || !option2El || !option3El || !option4El || !answerEl) {
      console.warn("Some elements are missing. Cannot save data.")
      return
    }
  
    const question = questionEl.value.trim()
    const option1 = option1El.value.trim()
    const option2 = option2El.value.trim()
    const option3 = option3El.value.trim()
    const option4 = option4El.value.trim()
    const answer = answerEl.value.trim()
  
    // Save the current question data to the quizData array
    quizData[currentQuestion - 1] = {
      question,
      option1,
      option2,
      option3,
      option4,
      answer,
    }
  
    // Save to localStorage
    localStorage.setItem("quizData", JSON.stringify(quizData))
    console.log("Data saved for question", currentQuestion)
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



function validateCurrentQuestion() {
  count = 0 // Reset count initially

  const questionEl = document.getElementById("question")
  const option1El = document.getElementById("option1")
  const option2El = document.getElementById("option2")
  const option3El = document.getElementById("option3")
  const option4El = document.getElementById("option4")
  const answerEl = document.getElementById(`answer${currentQuestion}`)
  const checkboxEl = document.getElementById(`acceptTerms${currentQuestion}`)

  if (!questionEl || !option1El || !option2El || !option3El || !option4El || !answerEl || !checkboxEl) {
    console.warn("Some form elements are missing")
    return false
  }

  const question = questionEl.value.trim()
  const options = [option1El.value.trim(), option2El.value.trim(), option3El.value.trim(), option4El.value.trim()]
  const answer = answerEl.value.trim()

  // Check if all fields are filled
  if (!question || options.some((opt) => !opt) || !answer) {
    alert("Please fill out all fields before proceeding.")
    checkboxEl.checked = false
    count++
    return false
  }

  // Clean options by removing prefixes (A., B., etc.)
  const cleanedOptions = options.map((option) => {
    return option.replace(/^[A-D]\.\s*/, "").trim()
  })

  // Validate no duplicate options
  for (let i = 0; i < cleanedOptions.length; i++) {
    for (let j = i + 1; j < cleanedOptions.length; j++) {
      if (cleanedOptions[i] === cleanedOptions[j] && cleanedOptions[i] !== "") {
        alert(`Duplicate option found: "${cleanedOptions[i]}"`)
        checkboxEl.checked = false
        count++
        return false
      }
    }
  }

  // Fixed regex pattern for options
  const optionPattern = /^(?:[A-D]\.\s+)?[A-Za-z0-9\s.,\-?!;:"']{2,}$/


  // Validate each option
  for (let i = 0; i < options.length; i++) {
    const cleanOption = cleanedOptions[i]

    if (!optionPattern.test(options[i])) {
      alert(`Invalid option: "${cleanOption}". It must be:
      - A number (e.g., 1, 42)
      - A word with at least two letters (e.g., "word")
      - A sentence (e.g., "Hello world.")
      
      Single letters like "a" or "z" are not allowed.`)
      checkboxEl.checked = false
      count++
      return false
    }
  }

  // If all validations passed
  count = 0
  return true
}

function nextQuestion() {
  const checkbox = document.getElementById(`acceptTerms${currentQuestion}`)
  if (!checkbox) {
    console.warn("Checkbox element not found")
    return
  }

  // Validate current question
  if (!validateCurrentQuestion()) {
    return // Block moving forward if validation fails
  }

  if (!checkbox.checked) {
    alert("❌ Please accept the Terms and Conditions before proceeding.")
    return // Block moving forward
  }

  // Save current question data before proceeding
  saveCurrentQuestionData()

  // Move to next
  currentQuestion++
  showQuestionForm()
}
function previousQuestion() {
  if (currentQuestion > 1) {
    // Save the current question data before moving back
    saveCurrentQuestionData()

    // Move to previous question
    currentQuestion--
    showQuestionForm()
  }
}

function submitQuizForm() {
  // If we're still on a question page, validate and save it
  if (currentQuestion <= totalQuestions) {
    if (!validateCurrentQuestion()) {
      return
    }
    saveCurrentQuestionData()
  }

  console.log("quizData:", quizData)
  console.log("totalQuestions:", totalQuestions)

  // Check if we have all the required data
  if (quizData.length < totalQuestions) {
    alert(`You've only completed ${quizData.length} of ${totalQuestions} questions. Please complete all questions.`)
    return
  }

  const form = document.getElementById("quizQuestionForm")
  if (!form) {
    alert("Form container is missing!")
    return
  }

  // Clear the form and add hidden fields
  form.innerHTML = ""
  form.innerHTML += `
    <input type="hidden" name="exp_no" value="${exp_no}">
    <input type="hidden" name="exp_title" value="${exp_title}">
    <input type="hidden" name="total_questions" value="${totalQuestion_1}">
    <input type="hidden" name="assignedTo" value="${assignedTo}">
    <input type="hidden" name="classId" value="${classId}">
  `

  console.log(
    "expno,exp-title,totalquestion,assignedTo,classId",
    exp_no,
    exp_title,
    totalQuestion_1,
    assignedTo,
    classId,
  )

  if (!exp_no || !exp_title || !totalQuestion_1) {
    alert("Missing experiment details! Please try again.")
    return
  }

  // Add all question data as hidden fields
  quizData.forEach((data, index) => {
    form.innerHTML += `
      <input type="hidden" name="question${index + 1}" value="${data.question || ""}">
      <input type="hidden" name="option1${index + 1}" value="${data.option1 || ""}">
      <input type="hidden" name="option2${index + 1}" value="${data.option2 || ""}">
      <input type="hidden" name="option3${index + 1}" value="${data.option3 || ""}">
      <input type="hidden" name="option4${index + 1}" value="${data.option4 || ""}">
      <input type="hidden" name="answer${index + 1}" value="${data.answer || ""}">
    `
  })

  // Clear localStorage and submit the form
  localStorage.removeItem("quizData")
  alert("Quiz Submitted Successfully!")
  form.submit()
}
function updateTitle() {
    const experimentNo = document.getElementById('exp_no').value;
    const titleInput = document.getElementById('exp_title');

    const titles = {
        1: 'Pendulum',
        2: 'Mass Spring System',
        3: 'Meter Rod Method',
        4: 'Force Table',
        5: 'Resonance Exp',
        // 6: 'Archimedes’ Principle'
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