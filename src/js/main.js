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
        window.sessionStorage.removeItem("currentElement");
        if (symbol) {
          function openMailClient(email, subject = "", body = "") {
            // Costruisce la mailto URL
            const mailto = `mailto:${email}?subject=${encodeURIComponent(
              subject
            )}&body=${encodeURIComponent(body)}`;

            // 1) Metodo principale: link invisibile con click simulato
            const a = document.createElement("a");
            a.href = mailto;
            a.style.display = "none";
            document.body.appendChild(a);

            let mailOpened = false;

            try {
              a.click();
              mailOpened = true;
            } catch (err) {
              mailOpened = false;
            }

            // Rimuove il link
            a.remove();

            // 2) Timeout: se in 800ms non succede nulla → significa che mailto è fallito
            setTimeout(() => {
              if (!mailOpened) {
                console.log(
                  "Mail client not opened, trying Gmail after 800ms..."
                );
                // Fallback Gmail
                const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${email}&su=${encodeURIComponent(
                  subject
                )}&body=${encodeURIComponent(body)}`;

                // Apri Gmail
                const w = window.open(gmailUrl, "_blank");

                // 3) Gmail bloccato? → ultimo fallback Outlook Web
                if (!w) {
                  const outlookUrl = `https://outlook.live.com/mail/deeplink/compose?to=${email}&subject=${encodeURIComponent(
                    subject
                  )}&body=${encodeURIComponent(body)}`;
                  window.open(outlookUrl, "_blank");
                }
              }
              alert("Email: " + email);
            }, 800);
          }

          if (symbol === "st")
            window.location.href = "https://www.lucca3.edu.it/";
          else if (symbol === "sg") openMailClient("LUIC84600N@istruzione.it");
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
