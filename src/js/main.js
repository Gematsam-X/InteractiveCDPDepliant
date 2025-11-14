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
    // Check if the class is not empty and not "special", "legend", "no-border" or "specialLegend"
    if (
      element.classList.length > 0 &&
      !element.classList.contains("legend") &&
      !element.classList.contains("no-border") &&
      !element.classList.contains("group") &&
      !element.classList.contains("period") &&
      !element.classList.contains("specialLegend") &&
      !element.classList.contains("special")
    ) {
      filteredElements.push(element);
      // Add a click event for redirection
      element.addEventListener("click", function () {
        element.style.transform = "scale(1.2)"; // Enlarge the element on click
        // Extract the symbol from the data attribute
        const symbol = element.getAttribute("data-symbol");
        // Redirect to the element's page
        window.sessionStorage.removeItem("currentElement");
        window.setTimeout(() => {
          resetDefaultStyle();
        }, 500);
        if (symbol)
          window.location.href =
            "elements/html/" + symbol.toLowerCase() + ".html";
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
      const elementName = cell.getAttribute("data-name");

      if (symbol && elementName) {
        temporaryData.push({
          symbol,
          elementName,
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

// Manage the selection of the current element in the periodic table
const currentElementSymbol = window.sessionStorage.getItem("currentElement");

if (currentElementSymbol) {
  const allElements = document.querySelectorAll("td");

  allElements.forEach((element) => {
    const symbol = element.getAttribute("data-symbol") || null;

    // Highlight only the current element
    if (symbol) {
      if (symbol.toLowerCase() === currentElementSymbol.toLowerCase()) {
        element.classList.remove("faded");
        element.style.transform = "scale(1.2)";
      } else {
        element.classList.add("faded");
      }
    } else {
      element.classList.add("faded");
    }
  });

  // Add the event listener for the click
  document.addEventListener("click", (event) => {
    const clickedElement = event.target;
    const isInsideHighlighted = [...allElements].some(
      (element) =>
        element.contains(clickedElement) && !element.classList.contains("faded")
    );

    // If you click outside the periodic table, restore the default style
    if (!isInsideHighlighted) {
      resetDefaultStyle();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  extractElementData(); // Extracts data
  checkElementsClass(); // Checks classes on elements
});