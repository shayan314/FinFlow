// ===== GLOBAL STATE =====
var revenueChartInstance = null;
var spendingChartInstance = null;
var analyticsInitialized = false;
var cardChartInit = false;
var currentTheme = 'dark';

// Stored chart instances takay theme change par update kar sakain
var allCharts = [];


// ===== THEME TOGGLE — YEH ASAL FIX HAI =====
function toggleTheme() {
    var html = document.documentElement;
    var icon = document.getElementById('themeIcon');

    if (currentTheme === 'dark') {
        currentTheme = 'light';
        html.setAttribute('data-theme', 'light');
        icon.className = 'fas fa-sun';
        showToast('Light mode enabled', 'success');
    } else {
        currentTheme = 'dark';
        html.setAttribute('data-theme', 'dark');
        icon.className = 'fas fa-moon';
        showToast('Dark mode enabled', 'success');
    }

    // localStorage mein save karo
    localStorage.setItem('finflow-theme', currentTheme);

    // Saare charts ke colors update karo
    updateChartColors();
}

// Theme load karo localStorage se
function loadTheme() {
    var saved = localStorage.getItem('finflow-theme');
    if (saved === 'light') {
        currentTheme = 'light';
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById('themeIcon').className = 'fas fa-sun';
    }
}

// Charts ke grid lines aur tick colors theme ke sath match karo
function updateChartColors() {
    var style = getComputedStyle(document.documentElement);
    var gridColor = style.getPropertyValue('--chart-grid').trim();
    var tickColor = style.getPropertyValue('--chart-tick').trim();

    for (var i = 0; i < allCharts.length; i++) {
        var chart = allCharts[i];
        if (!chart || !chart.options) continue;

        var scales = chart.options.scales;
        if (scales) {
            if (scales.x) {
                if (scales.x.grid) scales.x.grid.color = gridColor;
                if (scales.x.ticks) scales.x.ticks.color = tickColor;
            }
            if (scales.y) {
                if (scales.y.grid) scales.y.grid.color = gridColor;
                if (scales.y.ticks) scales.y.ticks.color = tickColor;
            }
        }

        // Legend colors bhi update karo
        if (chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
            chart.options.plugins.legend.labels.color = style.getPropertyValue('--text-secondary').trim();
        }

        chart.update('none');
    }
}

// Chart register karne ka helper
function registerChart(chartInstance) {
    if (chartInstance) allCharts.push(chartInstance);
}


// ===== NAVIGATION =====
function navigateTo(page) {
    document.querySelectorAll('.nav-item').forEach(function(item) {
        item.classList.remove('active');
    });

    var navItem = document.querySelector('.nav-item[data-page="' + page + '"]');
    if (navItem) navItem.classList.add('active');

    document.querySelectorAll('.page-section').forEach(function(section) {
        section.classList.remove('active');
    });

    var pageSection = document.getElementById('page-' + page);
    if (pageSection) pageSection.classList.add('active');

    var info = pageTitles[page];
    if (info) {
        document.getElementById('pageTitle').textContent = info.title;
        document.getElementById('pageSubtitle').textContent = info.subtitle;
    }

    if (page === 'analytics') initAnalyticsCharts();
    if (page === 'cards') initCardChart();

    closeSidebar();
    document.getElementById('mainContent').scrollTop = 0;
}

document.querySelectorAll('.nav-item[data-page]').forEach(function(item) {
    item.addEventListener('click', function() {
        navigateTo(this.getAttribute('data-page'));
    });
});

document.querySelector('.sidebar-user').addEventListener('click', function() {
    navigateTo('account');
});


// ===== MOBILE SIDEBAR =====
var sidebar = document.getElementById('sidebar');
var overlay = document.getElementById('sidebarOverlay');

document.getElementById('mobileMenuBtn').addEventListener('click', function() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
});

overlay.addEventListener('click', closeSidebar);

function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
}


// ===== TOAST =====
function showToast(message, type) {
    type = type || 'success';
    var container = document.getElementById('toastContainer');
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    var iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    toast.innerHTML = '<i class="fas ' + iconClass + '"></i> ' + message;
    container.appendChild(toast);

    setTimeout(function() {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(function() { toast.remove(); }, 300);
    }, 2500);
}


// ===== HELPERS FOR CHART COLORS =====
function getChartGridColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim();
}

function getChartTickColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--chart-tick').trim();
}

function getChartLegendColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
}

function getChartScaleOptions(showXGrid) {
    return {
        x: {
            grid: { display: !!showXGrid, color: getChartGridColor() },
            ticks: { color: getChartTickColor(), font: { size: 11 }, maxRotation: 0 }
        },
        y: {
            grid: { color: getChartGridColor() },
            ticks: { color: getChartTickColor(), font: { size: 11 } }
        }
    };
}


// ===== RECENT ACTIVITY =====
function renderRecentActivity() {
    var container = document.getElementById('recentActivity');
    var recent = transactions.slice(0, 6);
    var html = '';

    for (var i = 0; i < recent.length; i++) {
        var t = recent[i];
        var amtColor = t.amount > 0 ? 'var(--accent)' : 'var(--text-primary)';
        var amtPre = t.amount > 0 ? '+' : '';
        html += '<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border-subtle);">';
        html += '<div style="width:38px;height:38px;border-radius:10px;background:' + t.iconBg + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas ' + t.icon + '" style="font-size:14px;color:' + t.iconColor + ';"></i></div>';
        html += '<div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + t.name + '</div><div style="font-size:11px;color:var(--text-muted);">' + t.date + '</div></div>';
        html += '<div style="font-family:Space Grotesk;font-size:14px;font-weight:600;color:' + amtColor + ';flex-shrink:0;">' + amtPre + '$' + Math.abs(t.amount).toLocaleString() + '</div>';
        html += '</div>';
    }
    container.innerHTML = html;
}


// ===== TRANSACTIONS TABLE =====
function renderTransactions(filter) {
    filter = filter || 'all';
    var tbody = document.getElementById('transactionsBody');
    var filtered = transactions;

    if (filter === 'income')  filtered = transactions.filter(function(t) { return t.type === 'income'; });
    if (filter === 'expense') filtered = transactions.filter(function(t) { return t.type === 'expense'; });
    if (filter === 'pending') filtered = transactions.filter(function(t) { return t.status === 'pending'; });

    var html = '';
    for (var i = 0; i < filtered.length; i++) {
        var t = filtered[i];
        var amtColor = t.amount > 0 ? 'var(--accent)' : 'var(--danger)';
        var amtPre = t.amount > 0 ? '+' : '-';
        var badge = t.status === 'completed'
            ? '<span class="badge badge-success"><i class="fas fa-check"></i> Completed</span>'
            : '<span class="badge badge-warning"><i class="fas fa-clock"></i> Pending</span>';

        html += '<tr>';
        html += '<td><div style="display:flex;align-items:center;gap:12px;"><div style="width:36px;height:36px;border-radius:10px;background:' + t.iconBg + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas ' + t.icon + '" style="font-size:13px;color:' + t.iconColor + ';"></i></div><span style="font-weight:600;">' + t.name + '</span></div></td>';
        html += '<td style="color:var(--text-secondary);">' + t.category + '</td>';
        html += '<td style="color:var(--text-secondary);">' + t.date + '</td>';
        html += '<td><span style="font-family:Space Grotesk;font-weight:600;color:' + amtColor + ';">' + amtPre + '$' + Math.abs(t.amount).toLocaleString() + '</span></td>';
        html += '<td>' + badge + '</td>';
        html += '<td><button class="btn btn-outline" style="padding:5px 10px;font-size:11px;" onclick="showToast(\'Details opened\',\'success\')"><i class="fas fa-eye"></i></button></td>';
        html += '</tr>';
    }
    tbody.innerHTML = html;
}

document.querySelectorAll('#page-transactions .filter-chip').forEach(function(chip) {
    chip.addEventListener('click', function() {
        document.querySelectorAll('#page-transactions .filter-chip').forEach(function(c) { c.classList.remove('active'); });
        this.classList.add('active');
        renderTransactions(this.dataset.filter);
    });
});


// ===== BUDGETS =====
function renderBudgets() {
    var container = document.getElementById('budgetList');
    var html = '';
    for (var i = 0; i < budgets.length; i++) {
        var b = budgets[i];
        var pct = Math.min((b.spent / b.limit) * 100, 100);
        var isOver = pct >= 90;
        var barClr = isOver ? 'var(--danger)' : b.color;
        var txtClr = isOver ? 'var(--danger)' : 'var(--text-secondary)';

        html += '<div style="display:flex;align-items:center;gap:14px;padding:14px 22px;border-bottom:1px solid var(--border-subtle);">';
        html += '<div style="width:38px;height:38px;border-radius:10px;background:' + b.color + '15;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas ' + b.icon + '" style="color:' + b.color + ';font-size:14px;"></i></div>';
        html += '<div style="flex:1;min-width:0;"><div class="flex-between" style="margin-bottom:10px;"><span style="font-size:13px;font-weight:600;">' + b.name + '</span><span style="font-size:12px;color:' + txtClr + ';">$' + b.spent.toLocaleString() + ' / $' + b.limit.toLocaleString() + '</span></div><div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%;background:' + barClr + ';"></div></div></div>';
        html += '<div style="font-family:Space Grotesk;font-size:13px;font-weight:700;color:' + txtClr + ';min-width:38px;text-align:right;">' + Math.round(pct) + '%</div>';
        html += '</div>';
    }
    container.innerHTML = html;
}


// ===== SAVINGS =====
function renderSavings() {
    var container = document.getElementById('savingsGoals');
    var html = '';
    for (var i = 0; i < savingsGoals.length; i++) {
        var g = savingsGoals[i];
        var pct = Math.round((g.saved / g.target) * 100);
        var circ = 2 * Math.PI * 48;
        var off = circ - (pct / 100) * circ;

        html += '<div class="card"><div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap;">';
        html += '<div class="savings-ring"><svg width="120" height="120"><circle cx="60" cy="60" r="48" fill="none" stroke="var(--border)" stroke-width="8"/><circle cx="60" cy="60" r="48" fill="none" stroke="' + g.color + '" stroke-width="8" stroke-dasharray="' + circ + '" stroke-dashoffset="' + off + '" stroke-linecap="round" style="transition:stroke-dashoffset 1s ease;"/></svg><div class="savings-ring-text"><span style="font-family:Space Grotesk;font-size:22px;font-weight:700;">' + pct + '%</span></div></div>';
        html += '<div style="flex:1;min-width:140px;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"><i class="fas ' + g.icon + '" style="color:' + g.color + ';"></i><h4 style="font-size:15px;font-weight:600;">' + g.name + '</h4></div>';
        html += '<div style="font-size:13px;color:var(--text-secondary);margin-bottom:4px;">$' + g.saved.toLocaleString() + ' of $' + g.target.toLocaleString() + '</div>';
        html += '<div style="font-size:12px;color:var(--text-muted);">+$' + g.monthlyAdd + '/month</div>';
        html += '<button class="btn btn-outline" style="margin-top:12px;padding:6px 14px;font-size:12px;" onclick="showToast(\'Added $' + g.monthlyAdd + ' to ' + g.name + '\',\'success\')"><i class="fas fa-plus"></i> Add Funds</button></div></div></div>';
    }
    container.innerHTML = html;
}


// ===== DASHBOARD CHARTS =====
function initDashboardCharts() {
    var revCtx = document.getElementById('revenueChart').getContext('2d');
    var grad = revCtx.createLinearGradient(0, 0, 0, 240);
    grad.addColorStop(0, 'rgba(0, 230, 138, 0.2)');
    grad.addColorStop(1, 'rgba(0, 230, 138, 0.0)');

    revenueChartInstance = new Chart(revCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Revenue',
                data: [1200, 1900, 1400, 2200, 1800, 2600, 2100],
                borderColor: '#00e68a',
                backgroundColor: grad,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#00e68a',
                pointBorderColor: '#0a0f1a',
                pointBorderWidth: 2,
                borderWidth: 2.5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: getChartScaleOptions(false),
            interaction: { intersect: false, mode: 'index' },
        }
    });
    registerChart(revenueChartInstance);

    var spCtx = document.getElementById('spendingChart').getContext('2d');
    spendingChartInstance = new Chart(spCtx, {
        type: 'doughnut',
        data: {
            labels: ['Housing', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health'],
            datasets: [{
                data: [890, 424, 124, 66, 130, 230, 50],
                backgroundColor: ['#ff4d6a', '#ffb84d', '#00e68a', '#4dc3ff', '#a78bfa', '#f472b6', '#34d399'],
                borderColor: 'var(--bg-card)',
                borderWidth: 3,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: getChartLegendColor(), font: { size: 11 }, padding: 10, usePointStyle: true, pointStyleWidth: 8 }
                }
            }
        }
    });
    registerChart(spendingChartInstance);
}

// Revenue filter chips
document.querySelectorAll('#page-dashboard .filter-chip[data-range]').forEach(function(chip) {
    chip.addEventListener('click', function() {
        document.querySelectorAll('#page-dashboard .filter-chip[data-range]').forEach(function(c) { c.classList.remove('active'); });
        this.classList.add('active');

        var range = this.dataset.range;
        var labels, data;
        if (range === 'week') { labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']; data = [1200,1900,1400,2200,1800,2600,2100]; }
        else if (range === 'month') { labels = ['Week 1','Week 2','Week 3','Week 4']; data = [5200,6800,5900,7400]; }
        else { labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; data = [18200,21400,19800,24100,22300,25600,23900,27200,25400,28800,26100,30400]; }

        revenueChartInstance.data.labels = labels;
        revenueChartInstance.data.datasets[0].data = data;
        revenueChartInstance.update();
    });
});


// ===== ANALYTICS CHARTS =====
function initAnalyticsCharts() {
    if (analyticsInitialized) return;
    analyticsInitialized = true;

    var ieCtx = document.getElementById('incomeExpenseChart').getContext('2d');
    var c1 = new Chart(ieCtx, {
        type: 'bar',
        data: {
            labels: ['Jul','Aug','Sep','Oct','Nov','Dec'],
            datasets: [
                { label: 'Income', data: [7800,8200,7900,8600,8100,8240], backgroundColor: 'rgba(0,230,138,0.7)', borderRadius: 6, barPercentage: 0.6 },
                { label: 'Expenses', data: [3200,3800,2900,3600,3100,3180], backgroundColor: 'rgba(255,77,106,0.7)', borderRadius: 6, barPercentage: 0.6 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: getChartLegendColor(), usePointStyle: true, pointStyleWidth: 8, font: { size: 11 } } } },
            scales: getChartScaleOptions(false)
        }
    });
    registerChart(c1);

    var cfCtx = document.getElementById('cashFlowChart').getContext('2d');
    var cfGrad = cfCtx.createLinearGradient(0, 0, 0, 240);
    cfGrad.addColorStop(0, 'rgba(77,195,255,0.2)');
    cfGrad.addColorStop(1, 'rgba(77,195,255,0.0)');

    var c2 = new Chart(cfCtx, {
        type: 'line',
        data: {
            labels: ['Jul','Aug','Sep','Oct','Nov','Dec'],
            datasets: [{
                label: 'Net Cash Flow',
                data: [4600,4400,5000,5000,5000,5060],
                borderColor: '#4dc3ff',
                backgroundColor: cfGrad,
                fill: true, tension: 0.4,
                pointRadius: 4, pointBackgroundColor: '#4dc3ff', pointBorderColor: '#0a0f1a', pointBorderWidth: 2, borderWidth: 2.5,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: getChartScaleOptions(false)
        }
    });
    registerChart(c2);

    var mcCtx = document.getElementById('monthlyCompChart').getContext('2d');
    var c3 = new Chart(mcCtx, {
        type: 'bar',
        data: {
            labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            datasets: [{
                label: 'Spending',
                data: [3180,3600,2900,3400,3100,3200,3200,3800,2900,3600,3100,3180],
                backgroundColor: function(ctx) { return ctx.raw > 3500 ? 'rgba(255,77,106,0.6)' : 'rgba(0,230,138,0.5)'; },
                borderRadius: 4,
                barPercentage: 0.5,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: getChartScaleOptions(false)
        }
    });
    registerChart(c3);
}


// ===== CARD SPENDING CHART =====
function initCardChart() {
    if (cardChartInit) return;
    cardChartInit = true;

    var ctx = document.getElementById('cardSpendingChart').getContext('2d');
    var c = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Platinum', 'Gold'],
            datasets: [{
                data: [3240, 4100],
                backgroundColor: ['rgba(0,230,138,0.8)', 'rgba(167,139,250,0.8)'],
                borderColor: 'var(--bg-card)',
                borderWidth: 4,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '70%',
            plugins: {
                legend: { position: 'bottom', labels: { color: getChartLegendColor(), usePointStyle: true, pointStyleWidth: 8, padding: 16, font: { size: 11 } } }
            }
        }
    });
    registerChart(c);
}


// ===== ACCOUNT SAVE =====
function saveAccount() {
    var name = document.getElementById('accName').value;
    var email = document.getElementById('accEmail').value;
    if (!name || !email) { showToast('Please fill in all required fields', 'error'); return; }
    showToast('Account information saved successfully', 'success');
}


// ===== TOPBAR BUTTONS =====
document.getElementById('searchBtn').addEventListener('click', function() {
    showToast('Search feature activated', 'success');
});

document.getElementById('notifBtn').addEventListener('click', function() {
    showToast('You have 3 unread notifications', 'success');
});

// YEH THEME BUTTON HAI — AB ACTUALLY KAAM KAREGA
document.getElementById('themeBtn').addEventListener('click', function() {
    toggleTheme();
});


// ===== BACKGROUND DOTS =====
function createBgDots() {
    var container = document.getElementById('bgDots');
    for (var i = 0; i < 25; i++) {
        var dot = document.createElement('div');
        dot.className = 'bg-dot';
        dot.style.left = Math.random() * 100 + '%';
        dot.style.animationDelay = Math.random() * 8 + 's';
        dot.style.animationDuration = (6 + Math.random() * 6) + 's';
        container.appendChild(dot);
    }
}


// ===== INIT =====
function init() {
    loadTheme();         // Theme load karo pehle
    createBgDots();
    renderRecentActivity();
    renderTransactions();
    renderBudgets();
    renderSavings();
    initDashboardCharts();
}

document.addEventListener('DOMContentLoaded', init);