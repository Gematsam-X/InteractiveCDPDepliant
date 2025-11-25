// Add an event to execute data extraction when the page is ready
window.addEventListener("load", function () {
  extractElementData().catch((error) => {
    console.error("Error during data extraction:", error);
  });
});

// Select all <td> elements
let elements = document.querySelectorAll("td[data-symbol]");

// Create an empty array for elements with non-empty classes
let filteredElements = [];

// Iterate over each <td> element
function checkElementsClass() {
  elements.forEach((element) => {
    // Check if the class list is not empty and does not contain "no-border"
    if (
      element.classList.length > 0 &&
      !element.classList.contains("no-border")
    ) {
      filteredElements.push(element);
      // Add a click event for redirection
      element.addEventListener("click", function () {
        element.style.transform = "scale(1.2)"; // Enlarge the element on click
        // Extract the symbol from the data attribute
        const symbol = element.getAttribute("data-symbol");
        // Redirect to the element's page
        if (symbol) {
          if (symbol === "st")
            window.location.href = "https://www.lucca3.edu.it/";
          else
            window.location.href = "elements/" + symbol.toLowerCase() + ".html";
        }
      });
    }
  });
}

// Global variable for data
export let elementData = [];

// Function to extract chemical element data from the table, using Promise
async function extractElementData() {
  const rows = document.querySelectorAll(".periodic-table tr");
  const temporaryData = [];

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td[data-symbol]");
    cells.forEach((cell) => {
      const symbol = cell.getAttribute("data-symbol");

      if (symbol) {
        temporaryData.push({
          symbol,
        });
      }
    });
  });

  if (temporaryData.length > 0) {
    elementData = temporaryData;
  } else {
    throw new Error("No data found");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  extractElementData(); // Extracts data
  checkElementsClass(); // Checks classes on elements
});

document.addEventListener("DOMContentLoaded", () => {
  // Creiamo un finto evento mouseout sull’elemento attualmente hoverato
  const hovered = document.querySelectorAll(":hover");

  hovered.forEach((el) => {
    const evt = new MouseEvent("mouseout", {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    el.dispatchEvent(evt);
  });
});
