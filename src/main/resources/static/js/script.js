let authToken = null;

const API_BASE = 'http://localhost:8081';

// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('loginError');
  
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      authToken = data.token;
      
      // Hide login, show dashboard
      document.getElementById('login-container').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      
      // Load data
      loadUsers();
      loadTrades();
      loadSummary();
    } else {
      errorDiv.textContent = 'Invalid credentials';
      errorDiv.classList.add('show');
    }
  } catch (error) {
    errorDiv.textContent = 'Connection error: ' + error.message;
    errorDiv.classList.add('show');
  }
});

// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', (e) => {
    const tabName = e.currentTarget.dataset.tab;
    
    // Remove active from all
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    // Add active to clicked
    e.currentTarget.classList.add('active');
    document.getElementById(tabName).classList.add('active');
  });
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  authToken = null;
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('login-container').style.display = 'block';
  document.getElementById('loginForm').reset();
});

// Load Users
async function loadUsers() {
  try {
    const response = await fetch(`${API_BASE}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (response.ok) {
      const users = await response.json();
      displayUsers(users);
    }
  } catch (error) {
    document.getElementById('usersList').innerHTML = '<p>Error loading users</p>';
  }
}

function displayUsers(users) {
  if (!users || users.length === 0) {
    document.getElementById('usersList').innerHTML = '<p>No users found</p>';
    return;
  }
  
  let html = '<table><thead><tr><th>ID</th><th>Username</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
  
  users.forEach(user => {
    const status = user.active ? '<span class="status-active">Active</span>' : '<span class="status-inactive">Inactive</span>';
    html += `<tr>
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.role}</td>
      <td>${status}</td>
      <td>
        <button class="btn-small" onclick="openEditUserModal(${user.id}, '${user.username}', '${user.email}', '${user.role}', ${user.active})">Edit</button>
        <button class="btn-small" onclick="toggleUser(${user.id})">Toggle</button>
      </td>
    </tr>`;
  });
  
  html += '</tbody></table>';
  document.getElementById('usersList').innerHTML = html;
}

async function toggleUser(userId) {
  try {
    const response = await fetch(`${API_BASE}/api/admin/users/${userId}/toggle`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (response.ok) {
      loadUsers();
    }
  } catch (error) {
    alert('Error toggling user: ' + error.message);
  }
}

// Load Trades
async function loadTrades() {
  try {
    const response = await fetch(`${API_BASE}/api/admin/trades`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (response.ok) {
      const trades = await response.json();
      displayTrades(trades);
    }
  } catch (error) {
    document.getElementById('tradesList').innerHTML = '<p>Error loading trades</p>';
  }
}

function displayTrades(trades) {
  if (!trades || trades.length === 0) {
    document.getElementById('tradesList').innerHTML = '<p>No trades found</p>';
    return;
  }
  
  let html = '<table><thead><tr><th>ID</th><th>From</th><th>To</th><th>Amount</th><th>Rate</th><th>Result</th><th>Date</th><th>Action</th></tr></thead><tbody>';
  
  trades.forEach(trade => {
    const date = new Date(trade.tradeDate).toLocaleDateString();
    html += `<tr>
      <td>${trade.id}</td>
      <td>${trade.fromCurrency}</td>
      <td>${trade.toCurrency}</td>
      <td>${trade.amount}</td>
      <td>${trade.exchangeRate}</td>
      <td>${trade.resultAmount}</td>
      <td>${date}</td>
      <td><button class="btn-small" onclick="openEditTradeModal(${trade.id}, '${trade.fromCurrency}', '${trade.toCurrency}', ${trade.amount}, ${trade.exchangeRate}, ${trade.resultAmount}, '${trade.status}')">Edit</button></td>
    </tr>`;
  });
  
  html += '</tbody></table>';
  document.getElementById('tradesList').innerHTML = html;
}

// Load Summary
async function loadSummary() {
  try {
    const response = await fetch(`${API_BASE}/api/admin/summary`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (response.ok) {
      const summary = await response.json();
      displaySummary(summary);
    }
  } catch (error) {
    document.getElementById('summaryContent').innerHTML = '<p>Error loading summary</p>';
  }
}

function displaySummary(summary) {
  let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">';
  
  html += `
    <div style="background: #f0f0f0; padding: 20px; border-radius: 8px;">
      <h3>Total Users</h3>
      <p style="font-size: 2em; color: #667eea; font-weight: bold;">${summary.totalUsers || 0}</p>
    </div>
    <div style="background: #f0f0f0; padding: 20px; border-radius: 8px;">
      <h3>Total Trades</h3>
      <p style="font-size: 2em; color: #667eea; font-weight: bold;">${summary.totalTrades || 0}</p>
    </div>
    <div style="background: #f0f0f0; padding: 20px; border-radius: 8px;">
      <h3>Active Accounts</h3>
      <p style="font-size: 2em; color: #667eea; font-weight: bold;">${summary.activeAccounts || 0}</p>
    </div>
  `;
  
  html += '</div>';
  document.getElementById('summaryContent').innerHTML = html;
}

// Edit User Modal Functions
function openEditUserModal(userId, username, email, role, active) {
  document.getElementById('editUserId').value = userId;
  document.getElementById('editUsername').value = username;
  document.getElementById('editEmail').value = email;
  document.getElementById('editRole').value = role;
  document.getElementById('editActive').checked = active;
  document.getElementById('editUserModal').style.display = 'block';
}

function closeUserModal() {
  document.getElementById('editUserModal').style.display = 'none';
}

document.getElementById('editUserForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const userId = document.getElementById('editUserId').value;
  const username = document.getElementById('editUsername').value;
  const email = document.getElementById('editEmail').value;
  const role = document.getElementById('editRole').value;
  const active = document.getElementById('editActive').checked;
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ username, email, role, active })
    });
    
    if (response.ok) {
      closeUserModal();
      loadUsers();
      alert('User updated successfully');
    } else {
      alert('Error updating user');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

// Edit Trade Modal Functions
function openEditTradeModal(tradeId, fromCurrency, toCurrency, amount, exchangeRate, resultAmount, status) {
  document.getElementById('editTradeId').value = tradeId;
  document.getElementById('editFromCurrency').value = fromCurrency;
  document.getElementById('editToCurrency').value = toCurrency;
  document.getElementById('editAmount').value = amount;
  document.getElementById('editExchangeRate').value = exchangeRate;
  document.getElementById('editResultAmount').value = resultAmount;
  document.getElementById('editTradeStatus').value = status;
  document.getElementById('editTradeModal').style.display = 'block';
}

function closeTradeModal() {
  document.getElementById('editTradeModal').style.display = 'none';
}

document.getElementById('editTradeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const tradeId = document.getElementById('editTradeId').value;
  const fromCurrency = document.getElementById('editFromCurrency').value;
  const toCurrency = document.getElementById('editToCurrency').value;
  const amount = parseFloat(document.getElementById('editAmount').value);
  const exchangeRate = parseFloat(document.getElementById('editExchangeRate').value);
  const resultAmount = parseFloat(document.getElementById('editResultAmount').value);
  const status = document.getElementById('editTradeStatus').value;
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/trades/${tradeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ fromCurrency, toCurrency, amount, exchangeRate, resultAmount, status })
    });
    
    if (response.ok) {
      closeTradeModal();
      loadTrades();
      alert('Trade updated successfully');
    } else {
      alert('Error updating trade');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

// Close modals when clicking outside
window.addEventListener('click', (event) => {
  const userModal = document.getElementById('editUserModal');
  const tradeModal = document.getElementById('editTradeModal');
  
  if (event.target === userModal) {
    userModal.style.display = 'none';
  }
  if (event.target === tradeModal) {
    tradeModal.style.display = 'none';
  }
});

// Initial focus
document.getElementById('username').focus();