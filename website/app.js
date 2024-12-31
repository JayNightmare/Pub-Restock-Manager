// Drink Input Logic

const drinkInput = document.getElementById("drink-input");
const addDrinkButton = document.getElementById("add-drink");
const drinkList = document.getElementById("drink-list");
addDrinkButton.addEventListener("click", handleAddDrink);

const suggestionsBox = document.getElementById("suggestions-box");

// Filter and Display Suggestions
drinkInput.addEventListener("input", () => {
  const inputValue = drinkInput.value.trim().toLowerCase();
  suggestionsBox.innerHTML = ""; // Clear previous suggestions

  if (inputValue === "") {
    suggestionsBox.style.display = "none";
    return;
  }

  const filteredDrinks = drinks.filter((drink) =>
    drink.toLowerCase().includes(inputValue)
  );

  if (filteredDrinks.length > 0) {
    suggestionsBox.style.display = "block";
    filteredDrinks.forEach((drink) => {
      const suggestion = document.createElement("div");
      suggestion.textContent = drink;
      suggestion.addEventListener("click", () => {
        drinkInput.value = drink; // Populate input with clicked suggestion
        suggestionsBox.innerHTML = ""; // Clear suggestions
        suggestionsBox.style.display = "none"; // Hide suggestions box
      });
      suggestionsBox.appendChild(suggestion);
    });
  } else {
    suggestionsBox.style.display = "none";
  }
});

// Hide Suggestions on Blur
drinkInput.addEventListener("blur", () => {
  setTimeout(() => {
    suggestionsBox.style.display = "none";
  }, 200); // Timeout to allow click events on suggestions
});

drinkInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission if any

    // Get the first suggestion if available
    const firstSuggestion = suggestionsBox.querySelector("div");
    if (firstSuggestion) {
      drinkInput.value = firstSuggestion.textContent; // Fill input with first suggestion
      suggestionsBox.innerHTML = ""; // Clear suggestions
      suggestionsBox.style.display = "none"; // Hide suggestions box
    }

    handleAddDrink(); // Add the drink to the list
  }
});

function handleAddDrink() {
  const drinkName = drinkInput.value.trim();

  if (drinkName) {
    addDrinkToList(drinkName);
    drinkInput.value = "";
    drinkInput.focus(); // Keep the input field in focus for quicker inputs
  }
}

// Add event listener to the Add button
addDrinkButton.addEventListener("click", () => {
  const drinkName = drinkInput.value.trim();

  if (drinkName) {
    addDrinkToList(drinkName);
    drinkInput.value = "";
  }
});

// Function to add a drink to the list
function addDrinkToList(drinkName) {
  const listItem = document.createElement("li");
  listItem.classList.add("drink-item");

  // Drink Name
  const name = document.createElement("span");
  name.textContent = drinkName;

  // Buttons and count
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttons");

  const subtractButton = document.createElement("button");
  subtractButton.textContent = "-";
  subtractButton.classList.add("subtract");
  subtractButton.addEventListener("click", () => {
    const count = parseInt(countDisplay.textContent, 10);
    if (count > 0) countDisplay.textContent = count - 1;
  });

  const countDisplay = document.createElement("span");
  countDisplay.textContent = "0";

  const addButton = document.createElement("button");
  addButton.textContent = "+";
  addButton.classList.add("add");
  addButton.addEventListener("click", () => {
    const count = parseInt(countDisplay.textContent, 10);
    countDisplay.textContent = count + 1;
  });

  // Remove Button
  const removeButton = document.createElement("button");
  removeButton.classList.add("remove");
  removeButton.innerHTML = `
    <svg viewBox="0 0 448 512" width="20" title="trash">
      <path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z" />
    </svg>
  `;
  removeButton.addEventListener("click", () => {
    listItem.remove(); // Removes the item from the DOM
  });

  // Append buttons to the container
  buttonsContainer.appendChild(subtractButton);
  buttonsContainer.appendChild(countDisplay);
  buttonsContainer.appendChild(addButton);
  buttonsContainer.appendChild(removeButton);

  // Append name and buttons container to the list item
  listItem.appendChild(name);
  listItem.appendChild(buttonsContainer);

  // Append list item to the drink list
  drinkList.appendChild(listItem);
}

// -- //

// Print Logic

const printButton = document.getElementById("print-receipt");

// Add event listener to the Print Receipt button
printButton.addEventListener("click", () => {
  const drinks = [];
  const items = document.querySelectorAll(".drink-item");

  items.forEach((item) => {
    const drinkName = item.querySelector("span").textContent;
    const drinkCount = item.querySelector(".buttons span").textContent;

    if (parseInt(drinkCount, 10) > 0) {
      drinks.push({ name: drinkName, count: drinkCount });
    }
  });

  if (drinks.length > 0) {
    generateReceipt(drinks);
  } else {
    alert("No items to print!");
  }
});

// Function to generate and print the receipt
function generateReceipt(drinks) {
  const receiptWindow = window.open("", "_blank");
  receiptWindow.document.write(
    "<html><head><title>Receipt</title></head><body>"
  );
  receiptWindow.document.write("<h1>Restocking Receipt</h1>");
  receiptWindow.document.write(
    '<table border="1" style="width: 100%; text-align: left; border-collapse: collapse;">'
  );
  receiptWindow.document.write(
    "<thead><tr><th>Drink</th><th>Quantity</th></tr></thead><tbody>"
  );

  drinks.forEach((drink) => {
    receiptWindow.document.write(
      `<tr><td>${drink.name}</td><td>${drink.count}</td></tr>`
    );
  });

  receiptWindow.document.write("</tbody></table>");
  receiptWindow.document.write(
    '<p style="margin-top: 20px;">Thank you for using Pub Restock Manager!</p>'
  );
  receiptWindow.document.write("</body></html>");
  receiptWindow.document.close();
  receiptWindow.print();
}

// -- //

// Dark Mode Logic

const darkModeToggle = document.getElementById("dark-mode-toggle");

// Add event listener to toggle dark mode
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// -- //

// Manage Drinks

const manageDrinksButton = document.getElementById("manage-drinks-button");
const manageDrinksModal = document.getElementById("manage-drinks-modal");
const closeModalButton = document.getElementById("close-modal");

// Open Modal
manageDrinksButton.addEventListener("click", () => {
  manageDrinksModal.style.display = "block";
});

// Close Modal
closeModalButton.addEventListener("click", () => {
  manageDrinksModal.style.display = "none";
});

// Close Modal on Outside Click
window.addEventListener("click", (event) => {
  if (event.target === manageDrinksModal) {
    manageDrinksModal.style.display = "none";
  }
});

const drinkListManagement = document.getElementById("drink-list-management");
const addDrinkForm = document.getElementById("add-drink-form");
const newDrinkNameInput = document.getElementById("new-drink-name");

// Load drinks from localStorage
let drinks = JSON.parse(localStorage.getItem("drinks")) || [];

// Render the drinks list
function renderDrinkList() {
  drinkListManagement.innerHTML = "";
  drinks.forEach((drink, index) => {
    const card = document.createElement("li");
    card.classList.add("drink-card");

    // Drink Name
    const drinkName = document.createElement("span");
    drinkName.textContent = drink;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("remove");
    deleteButton.classList.add("manage-drinks");
    deleteButton.innerHTML = `
    <svg viewBox="0 0 448 512" width="20" title="trash">
      <path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z" />
    </svg>
  `;
    deleteButton.addEventListener("click", () => {
      if (confirm(`Are you sure you want to delete "${drink}"?`)) {
        drinks.splice(index, 1); // Remove the drink from the list
        saveDrinks();
        renderDrinkList();
      }
    });

    card.appendChild(drinkName);
    card.appendChild(deleteButton);
    drinkListManagement.appendChild(card);
  });
}

// Save drinks to localStorage
function saveDrinks() {
  localStorage.setItem("drinks", JSON.stringify(drinks));
}

// Add a new drink
addDrinkForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const newDrinkName = newDrinkNameInput.value.trim();
  if (newDrinkName && !drinks.includes(newDrinkName)) {
    drinks.push(newDrinkName); // Add the drink to the list
    saveDrinks();
    renderDrinkList();
    newDrinkNameInput.value = ""; // Clear the input
  }
});

// Initial render
renderDrinkList();

// -- //

// Load Drinks Logic

const loadDrinksButton = document.getElementById("load-drinks");

loadDrinksButton.addEventListener("click", () => {
  // Check if there are drinks in the Manage Drinks List
  if (drinks.length === 0) {
    alert("No drinks available in the Manage Drinks List.");
    return;
  }

  // Loop through drinks and add them to the Restocking List
  drinks.forEach((drink) => {
    // Check if the drink is already in the Restocking List
    const existingDrink = Array.from(drinkList.children).find((item) => {
      return item.querySelector("span").textContent === drink;
    });

    if (!existingDrink) {
      addDrinkToList(drink);
    }
  });

  alert("Drinks have been loaded into the Restocking List!");
});

// -- //