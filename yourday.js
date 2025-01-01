// Retrieve journal and goal entries from localStorage
let journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];

// Function to render all journal and goal entries
function renderEntries() {
    const entriesContainer = document.getElementById('journal-entries');
    entriesContainer.innerHTML = ''; // Clear the container before rendering

    journalEntries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('entry');
        
        entryDiv.innerHTML = `
            <h3>${entry.date}</h3>
            <p><strong>What you did:</strong> ${entry.activity}</p>
            <p><strong>How you felt:</strong> ${entry.mood}</p>
            <p><strong>Daily Goal:</strong> ${entry.goal}</p>
            <p><strong>Goal Achieved:</strong> ${entry.goalAchieved}</p>
            <p><strong>Water Intake Goal:</strong> ${entry.waterGoal} glasses</p>
            <p><strong>Calories Goal:</strong> ${entry.caloriesGoal} kcal</p>
            <p><strong>Exercise Goal:</strong> ${entry.exerciseGoal} minutes</p>
            <p><strong>Steps Goal:</strong> ${entry.stepsGoal} steps</p>
            <p><strong>Sleep Goal:</strong> ${entry.sleepGoal} hours</p>
            <p><strong>Protein Goal:</strong> ${entry.proteinGoal} grams</p>
        `;
        entriesContainer.appendChild(entryDiv);
    });
}

// Event listener for the combined form submission
document.getElementById('combined-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get journal form data
    const date = document.getElementById('date').value;
    const activity = document.getElementById('activity').value;
    const mood = document.getElementById('mood').value;
    const goal = document.getElementById('goal').value;
    const goalAchieved = document.getElementById('goal-achieved').value;

    // Get fitness goal data
    const waterGoal = document.getElementById('water-goal').value;
    const caloriesGoal = document.getElementById('calories-goal').value;
    const exerciseGoal = document.getElementById('exercise-goal').value;
    const stepsGoal = document.getElementById('steps-goal').value;
    const sleepGoal = document.getElementById('sleep-goal').value;
    const proteinGoal = document.getElementById('protein-goal').value;

    // Create an entry object
    const newEntry = {
        date,
        activity,
        mood,
        goal,
        goalAchieved,
        waterGoal,
        caloriesGoal,
        exerciseGoal,
        stepsGoal,
        sleepGoal,
        proteinGoal,
    };

    // Add to journal entries array
    journalEntries.push(newEntry);
    
    // Save to localStorage
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));

    // Render the updated entries
    renderEntries();

    // Reset form fields
    document.getElementById('combined-form').reset();
});
