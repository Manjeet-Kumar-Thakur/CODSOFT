const result = document.getElementById("result");
const historyList = document.getElementById("history");
const tooltip = document.getElementById("btn-tooltip");

const undoStack = [];
const redoStack = [];

const descriptions = {
  "AC": "Clear All",
  "DEL": "Delete Last Digit",
  "%": "Percentage",
  "/": "Divide",
  "*": "Multiply",
  "×": "Multiply",
  "+": "Add",
  "-": "Subtract",
  "=": "Calculate Result",
  ".": "Decimal Point",
  "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four",
  "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Nine",
  "📋": "Copy to Clipboard",
  "🎨": "Choose Color",
  "📜": "Toggle History",
  "🌗": "Toggle Theme"
};

// Load history on page load + enable keyboard
window.onload = () => {
  loadHistory();
  document.addEventListener("keydown", handleKeys);
};

// Keyboard support
function handleKeys(e) {
  if (e.key.match(/[0-9+\-*/%.]/)) {
    display(e.key);
  } else if (e.key === "Enter") {
    e.preventDefault();
    calculate();
  } else if (e.key === "Backspace") {
    del();
  } else if (e.key.toLowerCase() === "c") {
    clrs();
  }
}

// Display input
function display(num) {
  undoStack.push(result.value);
  result.value += num;
}

// Perform calculation
function calculate() {
  try {
    const expression = result.value;
    const final = eval(expression);
    result.value = final;
    saveToHistory(`${expression} = ${final}`);
  } catch {
    result.value = "Error";
  }
}

// Clear input
function clrs() {
  undoStack.push(result.value);
  result.value = "";
}

// Delete last digit
function del() {
  undoStack.push(result.value);
  result.value = result.value.slice(0, -1);
}

// Copy result to clipboard
function copyResult() {
  navigator.clipboard.writeText(result.value);
  alert("Copied: " + result.value);
}

// Toggle color picker input
function toggleColorPicker() {
  document.getElementById("themeColor").click();
}

// Change calculator background color
function changeColor(color) {
  const calculator = document.querySelector(".calculator");
  const input = document.getElementById("result");
  const buttons = document.querySelectorAll(".calculator button");

  calculator.style.backgroundColor = color;
  input.style.backgroundColor = color;
  buttons.forEach(btn => btn.style.backgroundColor = color);
}

// Toggle history panel visibility
function toggleHistory() {
  const historyBox = document.querySelector(".history-container");
  historyBox.style.display = historyBox.style.display === "none" ? "block" : "none";
}


function toggleMode() {
  document.body.classList.toggle("dark");
}


// Save expression to history
function saveToHistory(entry) {
  let data = JSON.parse(localStorage.getItem("calc-history")) || [];
  data.push(entry);
  localStorage.setItem("calc-history", JSON.stringify(data));
  addToDOM(entry);
}

// Load history from localStorage
function loadHistory() {
  let data = JSON.parse(localStorage.getItem("calc-history")) || [];
  data.forEach(addToDOM);
}

// Add history item to UI
function addToDOM(text) {
  const li = document.createElement("li");
  li.textContent = text;
  historyList.appendChild(li);
}

// Clear all history
function clearHistory() {
  localStorage.removeItem("calc-history");
  historyList.innerHTML = "";
}

// Undo/Redo via keyboard
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "z" && undoStack.length > 0) {
    redoStack.push(result.value);
    result.value = undoStack.pop();
  }
  if (e.ctrlKey && e.key === "y" && redoStack.length > 0) {
    undoStack.push(result.value);
    result.value = redoStack.pop();
  }
});

// Show tooltips on button hover
document.querySelectorAll(".calculator button").forEach(btn => {
  btn.addEventListener("mouseover", () => {
    const key = btn.innerText.trim();
    tooltip.innerText = descriptions[key] || "No description";
    const rect = btn.getBoundingClientRect();
    tooltip.style.top = `${rect.bottom + 5}px`;
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.display = "block";
  });

  btn.addEventListener("mouseout", () => {
    tooltip.style.display = "none";
  });
});
