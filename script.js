const SHEET_ID = "1GrkA4ArFYLAVIn9wYwziiKFXYDRfQ9CVCe52TFu-DNU"; // Updated Google Sheet ID
const API_KEY = "AIzaSyD5la1glnTC47uj40mGupnVn-iKRIBAJ-g"; // Replace with your Google Sheets API key
const RANGE = "Sheet1!A:Z"; // Adjust the range as needed

function checkForDuplicates() {
  const query = document.getElementById("searchBar").value.trim();
  const resultsDiv = document.getElementById("results");

  if (query === "") {
    resultsDiv.innerHTML =
      '<div class="error-box">Please enter a valid input.</div>';
    resultsDiv.className = "error";
    return;
  }

  fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (!data.values) {
        throw new Error("No data found in the sheet");
      }

      const values = data.values;
      let duplicateEntries = [];

      values.forEach((row) => {
        if (
          row.some(
            (cell) =>
              cell &&
              cell.toString().toLowerCase().includes(query.toLowerCase())
          )
        ) {
          duplicateEntries.push(row);
        }
      });

      displayResults(duplicateEntries);
    })
    .catch((error) => {
      console.error("Error:", error);
      resultsDiv.innerHTML =
        '<div class="error-box">Error retrieving data. Please check your API key and Sheet ID.</div>';
      resultsDiv.className = "error";
    });
}

function displayResults(duplicateEntries) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (duplicateEntries.length > 0) {
    resultsDiv.innerHTML = '<div class="duplicate-box">DUPLICATE FOUND!</div>';
    let tableContainer = document.createElement("div");
    tableContainer.style.display = "flex";
    tableContainer.style.justifyContent = "center";
    tableContainer.style.marginTop = "20px";

    let table = document.createElement("table");
    table.className = "duplicate-table";
    table.style.borderCollapse = "collapse";
    table.style.width = "80%";
    table.style.maxWidth = "600px";

    let tbody = document.createElement("tbody");

    duplicateEntries.forEach((entry) => {
      let row = document.createElement("tr");
      entry.forEach((cell) => {
        let cellElement = document.createElement("td");
        cellElement.innerText = cell;
        cellElement.style.border = "1px solid #000";
        cellElement.style.padding = "5px";
        row.appendChild(cellElement);
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    tableContainer.appendChild(table);
    resultsDiv.appendChild(tableContainer);
    resultsDiv.className = "duplicate";
  } else {
    resultsDiv.innerHTML = '<div class="good-box">NO DUPLICATES!</div>';
    resultsDiv.className = "good";
  }
}

document.title = "Dialexus Dupe Checker";
