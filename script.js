const categoryInput = document.getElementById('categoryInput');
const addChoiceButton = document.getElementById('addChoiceButton');
const choicesContainer = document.getElementById('choicesContainer');
const wheelColorPicker = document.getElementById('wheelColorPicker');
const createWheelButton = document.getElementById('createWheelButton');
const wheelsContainer = document.getElementById('wheelsContainer');
const resultsContainer = document.getElementById('resultsContainer');

let categories = []; // Array of { name: string, choices: string[], color: string }
let rotations = []; // Tracks rotation for each category

// Add Choice
addChoiceButton.addEventListener('click', () => {
    const choicesText = prompt("Enter your choices (separated by commas):");
    if (choicesText) {
        const categoryName = categoryInput.value.trim();
        if (!categoryName) {
            alert("Please enter a category name first.");
            return;
        }

        let selectedCategory = categories.find(cat => cat.name === categoryName);
        if (!selectedCategory) {
            selectedCategory = { name: categoryName, choices: [], color: wheelColorPicker.value };
            categories.push(selectedCategory);
        }

        // Split choices by commas and add them
        const newChoices = choicesText.split(',').map(choice => choice.trim()).filter(choice => choice.length > 0);
        selectedCategory.choices.push(...newChoices);

        // Update the UI to reflect the added choices
        updateChoicesUI(selectedCategory.choices);
    }
});

// Update Choices Display
function updateChoicesUI(choices) {
    choicesContainer.innerHTML = choices.map((choice, index) => `
        <div>
            <input type="text" value="${choice}" 
                oninput="editChoiceInput('${categoryInput.value.trim()}', ${index}, this.value)" />
            <button onclick="deleteChoice('${categoryInput.value.trim()}', ${index})">Delete</button>
        </div>
    `).join('');
}

// Edit Choice - Inline editing
function editChoiceInput(categoryName, index, newChoice) {
    const selectedCategory = categories.find(cat => cat.name === categoryName);
    if (selectedCategory) {
        selectedCategory.choices[index] = newChoice;
    }
}

// Delete Choice
function deleteChoice(categoryName, index) {
    const selectedCategory = categories.find(cat => cat.name === categoryName);
    if (selectedCategory) {
        selectedCategory.choices.splice(index, 1);
        updateChoicesUI(selectedCategory.choices);
    }
}

// Create Wheel
createWheelButton.addEventListener('click', () => {
    const categoryName = categoryInput.value.trim();
    const wheelColor = wheelColorPicker.value;

    if (!categoryName) {
        alert("Please enter a category name.");
        return;
    }

    let selectedCategory = categories.find(cat => cat.name === categoryName);
    if (!selectedCategory) {
        selectedCategory = { name: categoryName, choices: [], color: wheelColor };
        categories.push(selectedCategory);
    } else {
        selectedCategory.color = wheelColor;
    }

    renderWheel();
    clearForm();
});

// Clear Form
function clearForm() {
    categoryInput.value = '';
    updateChoicesUI([]);
}

// Draw the Wheel with Concentric Circles
function drawWheel(canvas, categories, rotations) {
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const numCategories = categories.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    categories.forEach((category, categoryIndex) => {
        const numChoices = category.choices.length;
        const angleStep = (2 * Math.PI) / numChoices;
        const innerRadius = (radius / numCategories) * categoryIndex;
        const outerRadius = (radius / numCategories) * (categoryIndex + 1);
        const rotationAngle = rotations[categoryIndex] || 0;

        category.choices.forEach((choice, choiceIndex) => {
            const startAngle = choiceIndex * angleStep + rotationAngle;
            const endAngle = startAngle + angleStep;

            ctx.beginPath();
            ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
            ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
            ctx.closePath();
            ctx.fillStyle = category.color || `hsl(${(choiceIndex / numChoices) * 360}, 100%, 50%)`;
            ctx.fill();
            ctx.stroke();

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate((startAngle + endAngle) / 2);
            ctx.textAlign = 'center'; // Center text within the segment
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            
            // Draw text ensuring it's centered within its respective section
            const textWidth = ctx.measureText(choice).width;
            const maxTextWidth = outerRadius - innerRadius - 10;
            if (textWidth > maxTextWidth) {
                choice = choice.slice(0, Math.floor(choice.length * (maxTextWidth / textWidth))); // truncate long text
            }
            ctx.fillText(choice, 0, outerRadius - 10);
            ctx.restore();
        });
    });
}

// Spin the Wheel
function spinWheel(canvas, categories) {
    const duration = 3000;
    const start = Date.now();
    const initialRotations = categories.map(() => Math.random() * 360);
    const finalRotations = initialRotations.map(rotation => rotation + 360 * 5 + Math.random() * 360);

    function animate() {
        const now = Date.now();
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);

        rotations = initialRotations.map((initialRotation, index) => {
            const finalRotation = finalRotations[index];
            return initialRotation + (finalRotation - initialRotation) * easeOutCubic(progress);
        });

        drawWheel(canvas, categories, rotations);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            displayRandomSelections(categories);
        }
    }

    animate();
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Display Random Selections
function displayRandomSelections(categories) {
    resultsContainer.innerHTML = categories.map(category => {
        const randomChoice = category.choices[Math.floor(Math.random() * category.choices.length)];
        return `<div>${category.name}: ${randomChoice}</div>`;
    }).join('');
}

// Add a click event listener to the canvas
wheelsContainer.addEventListener('click', (event) => {
    const canvas = event.target.closest('canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const x = event.clientX - rect.left - centerX;
    const y = event.clientY - rect.top - centerY;

    const angle = Math.atan2(y, x);
    const distance = Math.sqrt(x * x + y * y);

    let clickedCategory = null;

    // Identify the clicked section
    categories.some((category, categoryIndex) => {
        const numChoices = category.choices.length;
        const angleStep = (2 * Math.PI) / numChoices;
        const innerRadius = (canvas.width / 2 / categories.length) * categoryIndex;
        const outerRadius = innerRadius + canvas.width / 2 / categories.length;

        if (distance >= innerRadius && distance < outerRadius) {
            const normalizedAngle = (angle + 2 * Math.PI) % (2 * Math.PI);
            const choiceIndex = Math.floor(normalizedAngle / angleStep);

            clickedCategory = { categoryIndex, choiceIndex };
            return true; // Break the loop
        }

        return false;
    });

    if (clickedCategory) {
        const { categoryIndex, choiceIndex } = clickedCategory;
        const category = categories[categoryIndex];
        const choice = category.choices[choiceIndex];

        // Make the selected text editable and allow deletion
        const editedChoice = prompt("Edit your choice:", choice);
        if (editedChoice !== null) {
            if (editedChoice === '') {
                // Remove the choice if it is empty
                category.choices.splice(choiceIndex, 1);
            } else {
                category.choices[choiceIndex] = editedChoice;
            }
            renderWheel();
        }
    }
});

// Render the Main Wheel
function renderWheel() {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    wheelsContainer.innerHTML = '';
    wheelsContainer.appendChild(canvas);

    drawWheel(canvas, categories, rotations);

    const spinButton = document.createElement('button');
    spinButton.textContent = "Spin Wheel";
    spinButton.addEventListener('click', () => spinWheel(canvas, categories));
    wheelsContainer.appendChild(spinButton);
}
