document.addEventListener("DOMContentLoaded", () => {
  const questionWrapper = document.getElementById("question-wrapper");
  const questionContainer = document.getElementById("question-container");
  const questionElement = document.getElementById("question");
  const episodeIdElement = document.getElementById("episode-id");
  const nextButton = document.getElementById("next-button");
  const jsonButtons = document.querySelectorAll(".json-button");

  let elements = [];
  let currentElement = null;
  let showQuestion = true;

  const fetchData = async (file) => {
    try {
      const response = await fetch(file);
      const data = await response.json();
      elements = data.elements;
      changeElement(); // Choose a random element initially
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleQA = () => {
    showQuestion = !showQuestion;
    displayElement();
  };

  const changeElement = () => {
    const randomIndex = Math.floor(Math.random() * elements.length);
    currentElement = elements[randomIndex];
    showQuestion = true; // Reset to show question when a new element is chosen
    displayElement();
  };

  const displayElement = () => {
    if (currentElement) {
      questionElement.textContent = showQuestion ? currentElement.question : currentElement.answer;
      episodeIdElement.textContent = `ID: ${currentElement.id}`;
    }
  };

  jsonButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const file = button.getAttribute("data-file");
      fetchData(file);
    });
  });

  questionWrapper.addEventListener("click", toggleQA);
  nextButton.addEventListener("click", changeElement);

  // Load default JSON file initially
  fetchData("./public/gpt-new.json");
});
