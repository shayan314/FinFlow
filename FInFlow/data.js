var transactions = [
    { name: 'Salary Deposit', category: 'Income', icon: 'fa-building', iconBg: 'var(--accent-dim)', iconColor: 'var(--accent)', date: 'Jan 15, 2025', amount: 8240, type: 'income', status: 'completed' },
    { name: 'Rent Payment', category: 'Housing', icon: 'fa-home', iconBg: 'var(--danger-dim)', iconColor: 'var(--danger)', date: 'Jan 14, 2025', amount: -890, type: 'expense', status: 'completed' },
    { name: 'Grocery Store', category: 'Food', icon: 'fa-shopping-basket', iconBg: 'var(--warning-dim)', iconColor: 'var(--warning)', date: 'Jan 13, 2025', amount: -156, type: 'expense', status: 'completed' },
    { name: 'Freelance Project', category: 'Income', icon: 'fa-laptop-code', iconBg: 'var(--accent-dim)', iconColor: 'var(--accent)', date: 'Jan 12, 2025', amount: 1200, type: 'income', status: 'completed' },
    { name: 'Electric Bill', category: 'Utilities', icon: 'fa-bolt', iconBg: 'var(--info-dim)', iconColor: 'var(--info)', date: 'Jan 11, 2025', amount: -85, type: 'expense', status: 'pending' },
    { name: 'Netflix Subscription', category: 'Entertainment', icon: 'fa-film', iconBg: 'var(--danger-dim)', iconColor: 'var(--danger)', date: 'Jan 10, 2025', amount: -15.99, type: 'expense', status: 'completed' },
    { name: 'Uber Ride', category: 'Transport', icon: 'fa-car', iconBg: 'var(--warning-dim)', iconColor: 'var(--warning)', date: 'Jan 10, 2025', amount: -24, type: 'expense', status: 'completed' },
    { name: 'Online Shopping', category: 'Shopping', icon: 'fa-shopping-bag', iconBg: 'var(--info-dim)', iconColor: 'var(--info)', date: 'Jan 9, 2025', amount: -230, type: 'expense', status: 'pending' },
    { name: 'Gym Membership', category: 'Health', icon: 'fa-dumbbell', iconBg: 'var(--accent-dim)', iconColor: 'var(--accent)', date: 'Jan 8, 2025', amount: -50, type: 'expense', status: 'completed' },
    { name: 'Dividend Income', category: 'Income', icon: 'fa-chart-line', iconBg: 'var(--accent-dim)', iconColor: 'var(--accent)', date: 'Jan 7, 2025', amount: 340, type: 'income', status: 'completed' },
    { name: 'Restaurant Dinner', category: 'Food', icon: 'fa-utensils', iconBg: 'var(--warning-dim)', iconColor: 'var(--warning)', date: 'Jan 6, 2025', amount: -68, type: 'expense', status: 'completed' },
    { name: 'Internet Bill', category: 'Utilities', icon: 'fa-wifi', iconBg: 'var(--info-dim)', iconColor: 'var(--info)', date: 'Jan 5, 2025', amount: -45, type: 'expense', status: 'pending' },
];

var budgets = [
    { name: 'Housing & Rent', icon: 'fa-home', spent: 890, limit: 900, color: 'var(--danger)' },
    { name: 'Food & Groceries', icon: 'fa-utensils', spent: 424, limit: 600, color: 'var(--warning)' },
    { name: 'Transportation', icon: 'fa-car', spent: 124, limit: 300, color: 'var(--accent)' },
    { name: 'Entertainment', icon: 'fa-film', spent: 66, limit: 200, color: 'var(--accent)' },
    { name: 'Utilities', icon: 'fa-bolt', spent: 130, limit: 250, color: 'var(--info)' },
    { name: 'Shopping', icon: 'fa-shopping-bag', spent: 230, limit: 400, color: 'var(--warning)' },
    { name: 'Health & Fitness', icon: 'fa-heartbeat', spent: 50, limit: 150, color: 'var(--accent)' },
    { name: 'Education', icon: 'fa-graduation-cap', spent: 0, limit: 200, color: 'var(--info)' },
];

var savingsGoals = [
    { name: 'Emergency Fund', target: 10000, saved: 7500, icon: 'fa-shield-alt', color: 'var(--accent)', monthlyAdd: 500 },
    { name: 'Vacation Trip', target: 5000, saved: 2800, icon: 'fa-plane', color: 'var(--info)', monthlyAdd: 300 },
    { name: 'New Laptop', target: 2500, saved: 1800, icon: 'fa-laptop', color: 'var(--warning)', monthlyAdd: 200 },
    { name: 'Investment Fund', target: 17500, saved: 350, icon: 'fa-chart-line', color: 'var(--danger)', monthlyAdd: 1000 },
];

var pageTitles = {
    dashboard:    { title: 'Dashboard',    subtitle: 'Welcome back, Ahmed. Here\'s your financial overview.' },
    transactions: { title: 'Transactions', subtitle: 'View and manage all your transactions.' },
    analytics:    { title: 'Analytics',    subtitle: 'Deep dive into your financial patterns.' },
    budgets:      { title: 'Budgets',      subtitle: 'Track your spending against monthly budgets.' },
    account:      { title: 'Account',      subtitle: 'Manage your personal information and security.' },
    cards:        { title: 'Cards',        subtitle: 'Manage your debit and credit cards.' },
    savings:      { title: 'Savings',      subtitle: 'Track progress towards your financial goals.' },
    settings:     { title: 'Settings',     subtitle: 'Customize your app preferences.' },
};