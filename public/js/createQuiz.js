
document.addEventListener("DOMContentLoaded", function () {
  const formContainer = document.querySelector(".super_container");
  const secondForm = document.querySelector("#quizForm"); // Replace with the actual selector for your second form

  if (secondForm) {
      secondForm.addEventListener("focus", function () {
          formContainer.classList.add("second-form-active");
      });

      secondForm.addEventListener("blur", function () {
          formContainer.classList.remove("second-form-active");
      });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  let currentQuestion = 1;
  const totalQuestions = 0// Assumes this value is rendered by your server template

  function showQuestionForm() {
    const questionContainer = document.getElementById('quizQuestionForm');
    questionContainer.innerHTML = `
      <h3>Question ${currentQuestion}</h3>
      <label for="question${currentQuestion}">Question:</label>
      <input type="text" id="question${currentQuestion}" name="question${currentQuestion}" required><br>

      <label for="option1${currentQuestion}">Option 1:</label>
      <input type="text" id="option1${currentQuestion}" name="option1${currentQuestion}" required><br>

      <label for="option2${currentQuestion}">Option 2:</label>
      <input type="text" id="option2${currentQuestion}" name="option2${currentQuestion}" required><br>

      <label for="option3${currentQuestion}">Option 3:</label>
      <input type="text" id="option3${currentQuestion}" name="option3${currentQuestion}" required><br>

      <label for="option4${currentQuestion}">Option 4:</label>
      <input type="text" id="option4${currentQuestion}" name="option4${currentQuestion}" required><br>

      <label for="answer${currentQuestion}">Correct Answer:</label>
      <input type="text" id="answer${currentQuestion}" name="answer${currentQuestion}" required><br>
      
      <div style="margin-top: 20px;">
        <button type="button" onclick="prevQuestion()" ${currentQuestion === 1 ? 'disabled' : ''}>Previous</button>
        <button type="button" onclick="nextQuestion()" ${currentQuestion === totalQuestions ? 'disabled' : ''}>Next</button>
      </div>
    `;

  function nextQuestion() {
    if (currentQuestion < totalQuestions) {
      currentQuestion++;
      showQuestionForm();
    }
  }

  function prevQuestion() {
    if (currentQuestion > 1) {
      currentQuestion--;
      showQuestionForm();
    }
  }

  // Initial form render
  showQuestionForm();}
});
