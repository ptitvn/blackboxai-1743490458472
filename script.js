// User data storage
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let budgets = JSON.parse(localStorage.getItem('budgets')) || [];

// DOM Elements
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const budgetForm = document.getElementById('budget-form');
const monthSelect = document.getElementById('month-select');

// Check if user is logged in
if (currentUser) {
    document.querySelectorAll('#main-menu li a[href="login.html"]').forEach(el => el.style.display = 'none');
    document.querySelectorAll('#main-menu li a[href="register.html"]').forEach(el => el.style.display = 'none');
    if (logoutBtn) logoutBtn.style.display = 'block';
}

// Register form validation and submission
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Reset errors
        document.getElementById('email-error').classList.add('hidden');
        document.getElementById('password-error').classList.add('hidden');
        document.getElementById('confirm-error').classList.add('hidden');
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email-error').classList.remove('hidden');
            return;
        }
        
        // Validate password length
        if (password.length < 6) {
            document.getElementById('password-error').classList.remove('hidden');
            return;
        }
        
        // Validate password match
        if (password !== confirmPassword) {
            document.getElementById('confirm-error').classList.remove('hidden');
            return;
        }
        
        // Check if user already exists
        if (users.some(user => user.email === email)) {
            alert('Email đã được đăng ký!');
            return;
        }
        
        // Add new user
        users.push({ email, password });
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Đăng ký thành công!');
        window.location.href = 'login.html';
    });
}

// Login form submission
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Find user
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = { email };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            window.location.href = 'index.html';
        } else {
            document.getElementById('login-error').classList.remove('hidden');
        }
    });
}

// Logout functionality
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    });
}

// Budget form submission
if (budgetForm) {
    budgetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = document.getElementById('budget-amount').value;
        const month = monthSelect.value;
        
        if (!amount || !month) {
            document.getElementById('budget-error').classList.remove('hidden');
            return;
        }
        
        document.getElementById('budget-error').classList.add('hidden');
        
        // Save budget
        const existingIndex = budgets.findIndex(b => b.month === month && b.user === currentUser.email);
        
        if (existingIndex >= 0) {
            budgets[existingIndex].amount = amount;
        } else {
            budgets.push({
                user: currentUser.email,
                month,
                amount,
                expenses: []
            });
        }
        
        localStorage.setItem('budgets', JSON.stringify(budgets));
        updateBudgetDisplay(month);
    });
}

// Month selection change
if (monthSelect) {
    monthSelect.addEventListener('change', function() {
        const month = this.value;
        if (month) {
            updateBudgetDisplay(month);
        }
    });
}

// Update budget display
function updateBudgetDisplay(month) {
    const budget = budgets.find(b => b.month === month && b.user === currentUser?.email);
    
    if (budget) {
        document.getElementById('month-budget').textContent = `${budget.amount} VND`;
        
        // Calculate expenses (simplified for this example)
        const totalExpenses = budget.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const remaining = budget.amount - totalExpenses;
        
        document.getElementById('month-spent').textContent = `${totalExpenses} VND`;
        document.getElementById('month-remaining').textContent = `${remaining} VND`;
    } else {
        document.getElementById('month-budget').textContent = '0 VND';
        document.getElementById('month-spent').textContent = '0 VND';
        document.getElementById('month-remaining').textContent = '0 VND';
    }
}

// Initialize display if on index page
if (window.location.pathname.includes('index.html') && currentUser) {
    const currentMonth = new Date().getMonth() + 1;
    monthSelect.value = currentMonth;
    updateBudgetDisplay(currentMonth.toString());
}