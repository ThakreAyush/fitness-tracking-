document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('goal-form');
    const goalsContainer = document.getElementById('goals-container');
    const filterCategory = document.getElementById('filter-category');
    const filterPriority = document.getElementById('filter-priority');

    // Load goals from localStorage
    let goals = JSON.parse(localStorage.getItem('goals')) || [];

    // Check for due reminders
    checkReminders();

    // Format date for display
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Format datetime for display
    function formatDateTime(dateString) {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Show toast notification
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }

    // Check for due reminders
    function checkReminders() {
        const now = new Date();
        goals.forEach(goal => {
            if (goal.reminder && !goal.reminderShown) {
                const reminderDate = new Date(goal.reminder);
                if (now >= reminderDate) {
                    showNotification(goal);
                    if (goal.reminderType === 'once') {
                        goal.reminderShown = true;
                    }
                    saveGoals();
                }
            }
        });
    }

    // Show notification
    function showNotification(goal) {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Goal Reminder', {
                        body: `Don't forget: ${goal.title}`,
                        icon: '/favicon.ico'
                    });
                }
            });
        }
        showToast(`Reminder: ${goal.title}`, 'warning');
    }

    // Save goals to localStorage
    function saveGoals() {
        localStorage.setItem('goals', JSON.stringify(goals));
    }

    // Render goals with filters
    function renderGoals() {
        const categoryFilter = filterCategory.value;
        const priorityFilter = filterPriority.value;

        const filteredGoals = goals.filter(goal => {
            const categoryMatch = categoryFilter === 'all' || goal.category === categoryFilter;
            const priorityMatch = priorityFilter === 'all' || goal.priority === priorityFilter;
            return categoryMatch && priorityMatch;
        });

        goalsContainer.innerHTML = '';

        filteredGoals.forEach((goal, index) => {
            const goalElement = document.createElement('div');
            goalElement.className = 'goal-item';
            goalElement.innerHTML = `
                <div class="goal-content">
                    <div class="goal-title">${goal.title}</div>
                    <div class="goal-details">
                        <span class="category"><i class="fas fa-folder"></i> ${goal.category}</span> |
                        <span class="priority"><i class="fas fa-flag"></i> ${goal.priority}</span>
                    </div>
                    <div class="goal-dates">
                        <span><i class="fas fa-calendar-alt"></i> ${formatDate(goal.startDate)} - ${formatDate(goal.endDate)}</span>
                        ${goal.reminder ? `<br><span><i class="fas fa-bell"></i> Reminder: ${formatDateTime(goal.reminder)} (${goal.reminderType})</span>` : ''}
                    </div>
                </div>
                <div class="goal-actions">
                    <button class="edit-btn" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            const editBtn = goalElement.querySelector('.edit-btn');
            const deleteBtn = goalElement.querySelector('.delete-btn');

            editBtn.addEventListener('click', () => editGoal(index));
            deleteBtn.addEventListener('click', () => deleteGoal(index));

            goalsContainer.appendChild(goalElement);
        });
    }

    // Add new goal
    function addGoal(goal) {
        goals.push(goal);
        saveGoals();
        renderGoals();
        showToast('Goal added successfully!');
    }

    // Edit goal
    function editGoal(index) {
        const goal = goals[index];
        
        document.getElementById('goal-title').value = goal.title;
        document.getElementById('category').value = goal.category;
        document.getElementById('priority').value = goal.priority;
        document.getElementById('start-date').value = goal.startDate;
        document.getElementById('end-date').value = goal.endDate;
        document.getElementById('reminder-date').value = goal.reminder || '';
        document.getElementById('reminder-type').value = goal.reminderType || 'none';

        goals.splice(index, 1);
        saveGoals();
        renderGoals();
        
        document.getElementById('goal-input').scrollIntoView({ behavior: 'smooth' });
        showToast('Edit your goal and submit again', 'warning');
    }

    // Delete goal
    function deleteGoal(index) {
        if (confirm('Are you sure you want to delete this goal?')) {
            goals.splice(index, 1);
            saveGoals();
            renderGoals();
            showToast('Goal deleted successfully!', 'error');
        }
    }

    // Form submit handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        
        if (new Date(endDate) < new Date(startDate)) {
            showToast('End date cannot be before start date!', 'error');
            return;
        }

        const newGoal = {
            title: document.getElementById('goal-title').value,
            category: document.getElementById('category').value,
            priority: document.getElementById('priority').value,
            startDate: startDate,
            endDate: endDate,
            reminder: document.getElementById('reminder-date').value || null,
            reminderType: document.getElementById('reminder-type').value,
            reminderShown: false,
            createdAt: new Date().toISOString()
        };

        addGoal(newGoal);
        form.reset();
    });

    // Filter change handlers
    filterCategory.addEventListener('change', renderGoals);
    filterPriority.addEventListener('change', renderGoals);

    // Check reminders every minute
    setInterval(checkReminders, 60000);

    // Initial render
    renderGoals();
});