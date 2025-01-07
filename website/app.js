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
    showModal({
      title: "Duplicate Item",
      message: `${drinkName} is already in the Restocking List.`,
      buttons: [
        {
          text: "OK",
          class: "btn-confirm",
          onClick: closeModal,
        },
      ],
    });
    return;
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
    showModal({
      title: "No Items",
      message: "No items to print!",
      buttons: [
        {
          text: "OK",
          class: "btn-confirm",
          onClick: closeModal,
        },
      ],
    });
  }
});

// Function to generate and print the receipt
function generateReceipt(drinks) {
  const receiptWindow = window.open("", "_blank");
  receiptWindow.document.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            width: 57mm; /* Set the width to match PDQ paper */
            font-size: 12px; /* Adjust font size for small receipt */
          }
          h1 {
            text-align: center;
            font-size: 14px;
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            padding: 5px;
            text-align: left;
            font-size: 12px;
            border-bottom: 1px dashed #333;
          }
          th {
            font-weight: bold;
          }
          tr:last-child td {
            border-bottom: none; /* Remove border for the last row */
          }
          p {
            text-align: center;
            margin: 10px 0;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <h1>Restocking Receipt</h1>
        <table>
          <thead>
            <tr>
              <th>Drink</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            ${drinks
              .map(
                (drink) => `
                <tr>
                  <td>${drink.name}</td>
                  <td>${drink.count}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
        <p>Thank you for using Pub Restock Manager!</p>
      </body>
    </html>
  `);
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
      // Use showModal instead of confirm
      showModal({
        title: "Delete Drink",
        message: `Are you sure you want to delete "${drink}"?`,
        buttons: [
          {
            text: "Yes",
            class: "btn-confirm",
            onClick: () => {
              drinks.splice(index, 1); // Remove the drink from the list
              saveDrinks();
              renderDrinkList(); // Refresh the UI
              closeModal(); // Close the modal
            },
          },
          {
            text: "Cancel",
            class: "btn-cancel",
            onClick: closeModal, // Close the modal without deleting
          },
        ],
      });
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
  if (drinks.length === 0) {
    showModal({
      title: "No Items Available",
      message: "No drinks available to load.",
      buttons: [
        {
          text: "OK",
          class: "btn-confirm",
          onClick: closeModal,
        },
      ],
    });
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

  showModal({
    title: "Success",
    message: "Drinks have been loaded into the Restocking List!",
    buttons: [
      {
        text: "OK",
        class: "btn-confirm",
        onClick: closeModal,
      },
    ],
  });
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
    showModal({
      title: "Success",
      message: `List "${selectedPreset.replace("drinks-preset-", "")}" loaded successfully!`,
      buttons: [
        {
          text: "OK",
          class: "btn-confirm",
          onClick: closeModal,
        },
      ],
    });
  } else {
    showModal({
      title: "Error",
      message: `Failed to load the selected list`,
      buttons: [
        {
          text: "OK",
          class: "btn-confirm",
          onClick: closeModal,
        },
      ],
    });
  }

  loadOptionsModal.style.display = "none"; // Close modal
});

// Load from File
loadFromFileInput.addEventListener("change", (event) => {
  const file = event.target.files[0]; // Properly reference the file
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;
      // Parse the file content into the drinks array
      drinks = fileContent.split(",").map((item) => item.trim());

      // Use the modal to prompt the user for a list name
      showModal({
        title: "Name the List",
        message: "Save a name for the list:",
        input: true, // Enable the input field
        placeholder: "List Name", // Input placeholder
        buttons: [
          {
            text: "Load",
            class: "btn-confirm",
            onClick: (listName) => {
              if (!listName) {
                showModal({
                  title: "Error",
                  message: "List name cannot be empty. List will not be saved to dropdown.",
                  buttons: [
                    {
                      text: "OK",
                      class: "btn-confirm",
                      onClick: closeModal,
                    },
                  ],
                });
                return;
              }

              // Save the list to localStorage under the given name
              localStorage.setItem(`drinks-preset-${listName}`, JSON.stringify(drinks));

              // Update the dropdown with the new list
              updateSavedItemsDropdown();

              // Save the list to global drinks and update the UI
              saveDrinks();
              renderDrinkList();

              // Show success modal
              showModal({
                title: "Success",
                message: `List "${listName}" loaded successfully from file and saved.`,
                buttons: [
                  {
                    text: "OK",
                    class: "btn-confirm",
                    onClick: closeModal,
                  },
                ],
              });
            },
          },
          {
            text: "Cancel",
            class: "btn-cancel",
            onClick: closeModal,
          },
        ],
      });
    };
    reader.readAsText(file);
  } else {
    showModal({
      title: "Error",
      message: "No file selected. Please select a valid file.",
      buttons: [
        {
          text: "OK",
          class: "btn-confirm",
          onClick: closeModal,
        },
      ],
    });
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
  showModal({
    title: "Save List",
    message: "Enter a name for this list:",
    input: true, // Enable input field
    placeholder: "List Name", // Placeholder for input field
    buttons: [
      {
        text: "Save",
        class: "btn-confirm",
        onClick: (presetName) => {
          if (!presetName) {
            showModal({
              title: "Error",
              message: "List name cannot be empty.",
              buttons: [
                {
                  text: "OK",
                  class: "btn-confirm",
                  onClick: closeModal,
                },
              ],
            });
            return;
          }

          // Save drinks to localStorage
          const currentDrinks = [...drinks];
          localStorage.setItem(`drinks-preset-${presetName}`, JSON.stringify(currentDrinks));

          // Save as .txt file
          const blob = new Blob([currentDrinks.join(",")], { type: "text/plain" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${presetName}.txt`;
          link.click();

          // Update dropdown
          updateSavedItemsDropdown();

          // Success modal
          showModal({
            title: "Success",
            message: `List "${presetName}" saved successfully!`,
            buttons: [
              {
                text: "OK",
                class: "btn-confirm",
                onClick: closeModal,
              },
            ],
          });
        },
      },
      {
        text: "Cancel",
        class: "btn-cancel",
        onClick: closeModal,
      },
    ],
  });
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

  showModal({
    title: "Success",
    message: `The current list has been cleared!`,
    buttons: [
      {
        text: "OK",
        class: "btn-confirm",
        onClick: closeModal,
      },
    ],
  });
  deleteOptionsModal.style.display = "none"; // Close the modal
});

deleteEntireListButton.addEventListener("click", () => {
  // Retrieve all keys from localStorage
  const keys = Object.keys(localStorage);

  // Filter keys that match the prefix "drinks-preset-"
  const presetKeys = keys.filter((key) => key.startsWith("drinks-preset-"));

  if (presetKeys.length === 0) {
    showModal({
      title: "No Lists Found",
      message: "No saved lists found to delete.",
      buttons: [
        {
          text: "OK",
          class: "btn-confirm",
          onClick: closeModal,
        },
      ],
    });
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

  showModal({
    title: "Confirm Deletion",
    message: confirmMessage,
    buttons: [
      {
        text: "Yes",
        class: "btn-confirm",
        onClick: () => {
          // Delete matching keys from localStorage
          presetKeys.forEach((key) => {
            localStorage.removeItem(key);
          });

          // Update the dropdown options
          updateSavedItemsDropdown();

          // Reset the `drinks` array and clear UI
          drinks = [];
          saveDrinks();
          renderDrinkList();

          // Show success modal
          showModal({
            title: "Deleted",
            message:
              presetKeys.length === 1
                ? `The list "${presetKeys[0].replace(
                    "drinks-preset-",
                    ""
                  )}" has been deleted.`
                : `All saved lists (${presetKeys.length} lists) have been deleted.`,
            buttons: [
              {
                text: "OK",
                class: "btn-confirm",
                onClick: closeModal,
              },
            ],
          });
        },
      },
      {
        text: "Cancel",
        class: "btn-cancel",
        onClick: closeModal,
      },
    ],
  });

  // Close the delete options modal
  deleteOptionsModal.style.display = "none";
});

// Clear drinks from list
const clearRestockList = document.getElementById('clear-restock-list');

clearRestockList.addEventListener("click", () => {
  showModal({
        title: "Clear Restocking List",
        message: "Are you sure you want to clear all items from the Restocking List?",
        buttons: [
            {
                text: "Yes",
                class: "btn-confirm",
                onClick: () => {
                    drinkList.innerHTML = ""; // Clear the list
                    closeModal(); // Close the modal
                },
            },
            {
                text: "Cancel",
                class: "btn-cancel",
                onClick: closeModal,
            },
        ],
    });
});

// Custom Popup Logic
// Get modal elements
const modal = document.getElementById("custom-modal");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const modalButtons = document.getElementById("modal-buttons");
const modalCloseButton = document.getElementById("modal-close-button");

// Show Modal Function
function showModal({ title, message, input = false, placeholder = "", buttons }) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;

  // Clear existing buttons
  modalButtons.innerHTML = "";

  // Clear or add input field based on `input` parameter
  const inputField = document.getElementById("modal-input");
  if (input) {
    inputField.style.display = "block";
    inputField.placeholder = placeholder;
    inputField.value = ""; // Clear any previous value
  } else {
    inputField.style.display = "none";
  }

  // Add new buttons
  buttons.forEach((button) => {
    const btn = document.createElement("button");
    btn.textContent = button.text;
    btn.className = button.class || "btn-confirm";
    btn.addEventListener("click", () => button.onClick(input ? inputField.value : undefined));
    modalButtons.appendChild(btn);
  });

  // Show the modal
  modal.style.display = "block";
}

// Close Modal Function
function closeModal() {
    modal.style.display = "none";
}

// Close the modal when the close button is clicked
modalCloseButton.addEventListener("click", closeModal);

// Close the modal when clicking outside the modal content
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});
