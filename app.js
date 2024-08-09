document.addEventListener("DOMContentLoaded", () => {
  const questionWrapper = document.getElementById("question-wrapper");
  const questionElement = document.getElementById("question");
  const episodeIdElement = document.getElementById("episode-id");
  const episodeNameElement = document.getElementById("episode-name");
  const nextButton = document.getElementById("next-button");
  const googleButton = document.getElementById("google-button");
  const jsonSelect = document.getElementById("json-select");
  const rangeSelect = document.getElementById("range-select");

  let elements = [];
  let filteredElements = [];
  let currentElement = null;
  let showQuestion = true;

  const fetchData = async (file) => {
    try {
      const response = await fetch(file);
      const data = await response.json();
      elements = data.elements;
      populateSelectOptions();
      changeElement(); // Choose a random element initially
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const populateSelectOptions = () => {
    const maxId = Math.max(...elements.map((el) => el.id));
    rangeSelect.innerHTML = '<option value="all">All</option>';
    for (let i = 0; i < maxId; i += 200) {
      const rangeStart = i + 1;
      const rangeEnd = i + 200;
      const option = document.createElement("option");
      option.value = `${rangeStart}-${rangeEnd}`;
      option.textContent = `${rangeStart}-${rangeEnd}`;
      rangeSelect.appendChild(option);
    }
  };

  const filterElementsByRange = (range) => {
    if (range === "all") {
      filteredElements = elements;
    } else {
      const [start, end] = range.split("-").map(Number);
      filteredElements = elements.filter((el) => el.id >= start && el.id <= end);
    }
    changeElement();
  };

  const toggleQA = () => {
    showQuestion = !showQuestion;
    displayElement();
  };

  const changeElement = () => {
    if (filteredElements.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredElements.length);
    currentElement = filteredElements[randomIndex];
    showQuestion = true; // Reset to show question when a new element is chosen
    displayElement();
  };

  const displayElement = () => {
    if (currentElement) {
      questionElement.textContent = showQuestion ? currentElement.question : currentElement.answer;
      episodeIdElement.textContent = `ID: ${currentElement.id}`;
      if (currentElement.episode && currentElement.episode.trim() !== "") {
        episodeNameElement.style.display = "block";
        episodeNameElement.textContent = `episode: ${currentElement.episode}`;
      } else {
        episodeNameElement.style.display = "none";
      }
    }
  };

  const searchGoogle = () => {
    const query = questionElement.textContent;
    if (query) {
      const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      window.open(googleUrl, "_blank");
    }
  };

  jsonSelect.addEventListener("change", () => {
    const file = jsonSelect.value;
    fetchData(file);
  });

  questionWrapper.addEventListener("click", toggleQA);
  nextButton.addEventListener("click", changeElement);
  googleButton.addEventListener("click", searchGoogle);
  rangeSelect.addEventListener("change", (e) => filterElementsByRange(e.target.value));

  // Load default JSON file initially
  fetchData("./public/chomik.json");
});
