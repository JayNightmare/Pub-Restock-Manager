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
    // Check if the drink already exists in the Restocking List
    const existingDrink = Array.from(drinkList.children).find((item) => {
        return item.querySelector("span").textContent === drinkName;
    });

    if (existingDrink) {
        alert(`${drinkName} is already in the Restocking List.`);
        return; // Exit if the drink is already in the list
    }

    // Create List Item
    const listItem = document.createElement("li");
    listItem.classList.add("drink-item");

    // Drink Name
    const name = document.createElement("span");
    name.textContent = drinkName;

    // Buttons and Count
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

// Function to display the receipt on the phone
function displayReceiptOnPhone(drinks) {
    // Create a full-screen modal-like container for the receipt
    const receiptContainer = document.createElement("div");
    receiptContainer.style.position = "fixed";
    receiptContainer.style.top = "0";
    receiptContainer.style.left = "0";
    receiptContainer.style.width = "100%";
    receiptContainer.style.height = "100%";
    receiptContainer.style.backgroundColor = "white";
    receiptContainer.style.zIndex = "1000";
    receiptContainer.style.overflowY = "auto";
    receiptContainer.style.padding = "20px";

    // Back button to close the receipt view
    const backButton = document.createElement("button");
    backButton.textContent = "Back";
    backButton.style.position = "fixed";
    backButton.style.top = "10px";
    backButton.style.left = "10px";
    backButton.style.padding = "10px 15px";
    backButton.style.backgroundColor = "#007bff";
    backButton.style.color = "white";
    backButton.style.border = "none";
    backButton.style.borderRadius = "5px";
    backButton.style.cursor = "pointer";
    backButton.style.fontSize = "16px";

    // Add an event listener to the back button
    backButton.addEventListener("click", () => {
        document.body.removeChild(receiptContainer); // Remove the receipt view
    });

    // Receipt title
    const title = document.createElement("h1");
    title.textContent = "Restocking Receipt";
    title.style.textAlign = "center";
    title.style.margin = "20px 0";
    title.style.fontSize = "24px";

    // Table to display the drinks and quantities
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "20px";
    table.style.fontSize = "18px";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const drinkHeader = document.createElement("th");
    drinkHeader.textContent = "Drink";
    drinkHeader.style.textAlign = "left";
    drinkHeader.style.padding = "10px";
    drinkHeader.style.borderBottom = "2px solid #ddd";

    const quantityHeader = document.createElement("th");
    quantityHeader.textContent = "Qty";
    quantityHeader.style.textAlign = "left";
    quantityHeader.style.padding = "10px";
    quantityHeader.style.borderBottom = "2px solid #ddd";

    headerRow.appendChild(drinkHeader);
    headerRow.appendChild(quantityHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Add drinks to the table
    const tbody = document.createElement("tbody");
    drinks.forEach((drink) => {
        const row = document.createElement("tr");

        const drinkName = document.createElement("td");
        drinkName.textContent = drink.name;
        drinkName.style.padding = "10px";
        drinkName.style.borderBottom = "1px solid #ddd";

        const drinkQuantity = document.createElement("td");
        drinkQuantity.textContent = drink.count;
        drinkQuantity.style.padding = "10px";
        drinkQuantity.style.borderBottom = "1px solid #ddd";

        row.appendChild(drinkName);
        row.appendChild(drinkQuantity);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    // Add a footer message
    const footerMessage = document.createElement("p");
    footerMessage.textContent = "Thank you for using Pub Restock Manager!";
    footerMessage.style.textAlign = "center";
    footerMessage.style.marginTop = "20px";
    footerMessage.style.fontSize = "16px";

    // Append everything to the receipt container
    receiptContainer.appendChild(backButton);
    receiptContainer.appendChild(title);
    receiptContainer.appendChild(table);
    receiptContainer.appendChild(footerMessage);

    // Append the receipt container to the body
    document.body.appendChild(receiptContainer);
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

const loadOptionsModal = document.getElementById("load-options-modal");
const loadFromDropdownButton = document.getElementById("load-from-dropdown");
const loadFromFileInput = document.getElementById("load-from-file");
const cancelLoadButton = document.getElementById("cancel-load");

// Show Load Options Modal
document.getElementById("load-items-order").addEventListener("click", () => {
    loadOptionsModal.style.display = "block";
});

// Cancel Load
cancelLoadButton.addEventListener("click", () => {
    loadOptionsModal.style.display = "none";
});

// Load from Dropdown
loadFromDropdownButton.addEventListener("click", () => {
    const selectedPreset = savedItemsList.value;

    // Load from localStorage
    const savedDrinks = JSON.parse(localStorage.getItem(selectedPreset));
    if (savedDrinks) {
        drinks = [...savedDrinks];
        saveDrinks();
        renderDrinkList();
        alert(
            `List "${selectedPreset.replace(
                "drinks-preset-",
                ""
            )}" loaded successfully!`
        );
    } else {
        alert("Failed to load the selected list.");
    }

    loadOptionsModal.style.display = "none"; // Close modal
});

// Load from File
loadFromFileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target.result;
            // Parse the file content into the drinks array
            drinks = fileContent.split(",").map((item) => item.trim());

            // Prompt the user for a name for the list
            const listName = prompt("Enter a name for this list:");
            if (!listName) {
                alert(
                    "List name cannot be empty. List will not be saved to dropdown."
                );
                return;
            }

            // Save the list to localStorage under the given name
            localStorage.setItem(
                `drinks-preset-${listName}`,
                JSON.stringify(drinks)
            );

            // Update the dropdown with the new list
            updateSavedItemsDropdown();

            // Save the list to global drinks and update the UI
            saveDrinks();
            renderDrinkList();

            alert(
                `List "${listName}" loaded successfully from file and saved.`
            );
        };
        reader.readAsText(file);
    }

    loadOptionsModal.style.display = "none"; // Close modal
});

// -- //

// Save Items Logic

const saveItemsButton = document.getElementById("save-items-order");
const savedItemsList = document.getElementById("saved-items-list");

// Update Dropdown
function updateSavedItemsDropdown() {
    savedItemsList.innerHTML = '<option value="">Select a saved list</option>'; // Clear existing options
    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("drinks-preset-")) {
            const option = document.createElement("option");
            option.value = key;
            option.textContent = key.replace("drinks-preset-", ""); // Remove prefix for display
            savedItemsList.appendChild(option);
        }
    });
}

// Initialize dropdown on page load
updateSavedItemsDropdown();

// Save current drinks list to localStorage
saveItemsButton.addEventListener("click", () => {
    const presetName = prompt("Enter a name for this list:");
    if (!presetName) {
        alert("List name cannot be empty.");
        return;
    }

    // Save drinks to localStorage
    const currentDrinks = [...drinks];
    localStorage.setItem(
        `drinks-preset-${presetName}`,
        JSON.stringify(currentDrinks)
    );

    // Save as .txt file
    const blob = new Blob([currentDrinks.join(",")], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${presetName}.txt`;
    link.click();

    // Update dropdown
    updateSavedItemsDropdown();
    alert(`List "${presetName}" saved successfully!`);
});

// Delete Button Logic
const deleteItemsButton = document.getElementById("delete-items-order");
const deleteOptionsModal = document.getElementById("delete-options-modal");
const clearCurrentListButton = document.getElementById("clear-current-list");
const deleteEntireListButton = document.getElementById("delete-entire-list");
const cancelDeleteButton = document.getElementById("cancel-delete");

// Show the delete options modal
deleteItemsButton.addEventListener("click", () => {
    deleteOptionsModal.style.display = "block";
});

// Hide the modal on cancel
cancelDeleteButton.addEventListener("click", () => {
    deleteOptionsModal.style.display = "none";
});

clearCurrentListButton.addEventListener("click", () => {
    // Clear the current list in both UI and memory
    drinks = []; // Clear the global drinks array
    saveDrinks(); // Save the cleared drinks array to localStorage
    renderDrinkList(); // Refresh the Manage Items UI

    alert("The current list has been cleared.");
    deleteOptionsModal.style.display = "none"; // Close the modal
});

deleteEntireListButton.addEventListener("click", () => {
    // Retrieve all keys from localStorage
    const keys = Object.keys(localStorage);

    // Filter keys that match the prefix "drinks-preset-"
    const presetKeys = keys.filter((key) => key.startsWith("drinks-preset-"));

    if (presetKeys.length === 0) {
        alert("No saved lists found to delete.");
        return;
    }

    // Confirm deletion
    const confirmMessage =
        presetKeys.length === 1
            ? `Are you sure you want to delete the list "${presetKeys[0].replace(
                "drinks-preset-",
                ""
            )}"?`
            : `Are you sure you want to delete all saved lists (${presetKeys.length} lists)?`;
    if (!confirm(confirmMessage)) return;

    // Delete matching keys from localStorage
    presetKeys.forEach((key) => {
        localStorage.removeItem(key);
    });

    // Update the dropdown options
    updateSavedItemsDropdown();

    // If the current drinks list matches a deleted preset, clear the UI
    drinks = [];
    saveDrinks();
    renderDrinkList();

    // Notify the user
    alert(
        presetKeys.length === 1
            ? `The list "${presetKeys[0].replace(
                "drinks-preset-",
                ""
            )}" has been deleted.`
            : `All saved lists (${presetKeys.length} lists) have been deleted.`
    );

    // Close the modal
    deleteOptionsModal.style.display = "none";
});
