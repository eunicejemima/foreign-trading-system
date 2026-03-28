let authToken = null;
let usersCache = [];
let currenciesCache = [];

const API_BASE = 'http://localhost:8081';

// Login Button Handler
document.getElementById('loginBtn').addEventListener('click', async (e) => {
  e.preventDefault();
  await handleLogin();
});

// Allow Enter key to submit
document.getElementById('loginForm').addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    await handleLogin();
  }
});

async function handleLogin() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('loginError');
  
  // Clear previous errors
  errorDiv.textContent = '';
  errorDiv.classList.remove('show');
  
  try {
    console.log('Logging in with:', username);
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.ok && data.token) {
      authToken = data.token;
      console.log('Token set:', authToken);
      localStorage.setItem('authToken', data.token);
      
      // Clear form
      document.getElementById('loginForm').reset();
      
      // Hide login, show dashboard
      document.getElementById('login-container').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      console.log('Dashboard shown');
      
      // Scroll to top
      window.scrollTo(0, 0);
      
      // Load data with error handling
      try {
        await loadUsers();
      } catch (err) {
        console.error('Error loading users:', err);
      }
      
      try {
        await loadTrades();
      } catch (err) {
        console.error('Error loading trades:', err);
      }
      
      try {
        await loadCurrencies();
      } catch (err) {
        console.error('Error loading currencies:', err);
      }
      
      try {
        await loadSummary();
      } catch (err) {
        console.error('Error loading summary:', err);
      }
      
      console.log('Successfully logged in as:', data.username);
    } else {
      errorDiv.textContent = 'Invalid credentials. Please try again.';
      errorDiv.classList.add('show');
    }
  } catch (error) {
    console.error('Login error:', error);
    errorDiv.textContent = 'Connection error: ' + error.message;
    errorDiv.classList.add('show');
  }
}

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
  localStorage.removeItem('authToken');
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
    
    if (!response.ok) {
      console.error('Failed to load users:', response.status);
      document.getElementById('usersList').innerHTML = '<p>Error loading users</p>';
      return;
    }
    
    const users = await response.json();
    usersCache = Array.isArray(users) ? users : [];
    displayUsers(usersCache);
    populateTradeUserOptions(usersCache);
    return usersCache;
  } catch (error) {
    console.error('Error loading users:', error);
    document.getElementById('usersList').innerHTML = '<p>Error loading users</p>';
    usersCache = [];
    populateTradeUserOptions(usersCache);
    return [];
  }
}

function populateTradeUserOptions(users) {
  const userSelect = document.getElementById('createTradeUserId');
  if (!userSelect) {
    return;
  }

  const safeUsers = Array.isArray(users) ? users : [];
  const preferredUsers = safeUsers.filter(user => user.active);
  const sourceUsers = preferredUsers.length > 0 ? preferredUsers : safeUsers;

  if (sourceUsers.length === 0) {
    userSelect.innerHTML = '<option value="" selected>No users available</option>';
    userSelect.disabled = true;
    return;
  }

  let options = '<option value="" disabled selected>Select user</option>';
  sourceUsers.forEach(user => {
    options += `<option value="${user.id}">${user.username} (ID: ${user.id})</option>`;
  });

  userSelect.innerHTML = options;
  userSelect.disabled = false;
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
        <button class="btn-small btn-danger" onclick="deleteUser(${user.id})">Delete</button>
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
    
    if (!response.ok) {
      console.error('Failed to load trades:', response.status);
      document.getElementById('tradesList').innerHTML = '<p>Error loading trades</p>';
      return;
    }
    
    const trades = await response.json();
    displayTrades(trades);
  } catch (error) {
    console.error('Error loading trades:', error);
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
      <td><button class="btn-small" onclick="openEditTradeModal(${trade.id}, '${trade.fromCurrency}', '${trade.toCurrency}', ${trade.amount}, ${trade.exchangeRate}, ${trade.resultAmount}, '${trade.status}')">Edit</button>
        <button class="btn-small btn-danger" onclick="deleteTrade(${trade.id})">Delete</button></td>
    </tr>`;
  });
  
  html += '</tbody></table>';
  document.getElementById('tradesList').innerHTML = html;
}

// Load Currencies
async function loadCurrencies() {
  try {
    const response = await fetch(`${API_BASE}/api/admin/currencies`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (!response.ok) {
      console.error('Failed to load currencies:', response.status);
      document.getElementById('currenciesList').innerHTML = '<p>Error loading currencies</p>';
      currenciesCache = [];
      populateTradeCurrencyOptions(currenciesCache);
      return;
    }
    
    const currencies = await response.json();
    currenciesCache = Array.isArray(currencies) ? currencies : [];
    displayCurrencies(currenciesCache);
    populateTradeCurrencyOptions(currenciesCache);
    return currenciesCache;
  } catch (error) {
    console.error('Error loading currencies:', error);
    document.getElementById('currenciesList').innerHTML = '<p>Error loading currencies</p>';
    currenciesCache = [];
    populateTradeCurrencyOptions(currenciesCache);
    return [];
  }
}

function populateTradeCurrencyOptions(currencies) {
  const fromSelect = document.getElementById('createTradeFromCurrency');
  const toSelect = document.getElementById('createTradeToCurrency');
  if (!fromSelect || !toSelect) {
    return;
  }

  const safeCurrencies = Array.isArray(currencies) ? currencies : [];
  if (safeCurrencies.length === 0) {
    fromSelect.innerHTML = '<option value="" selected>No currencies available</option>';
    toSelect.innerHTML = '<option value="" selected>No currencies available</option>';
    fromSelect.disabled = true;
    toSelect.disabled = true;
    return;
  }

  let options = '<option value="" disabled selected>Select currency</option>';
  safeCurrencies.forEach(currency => {
    options += `<option value="${currency.code}">${currency.code} - ${currency.name}</option>`;
  });

  fromSelect.innerHTML = options;
  toSelect.innerHTML = options;
  fromSelect.disabled = false;
  toSelect.disabled = false;
}

function displayCurrencies(currencies) {
  if (!currencies || currencies.length === 0) {
    document.getElementById('currenciesList').innerHTML = '<p>No currencies found</p>';
    return;
  }
  
  let html = '<table><thead><tr><th>ID</th><th>Code</th><th>Name</th><th>Exchange Rate</th><th>Actions</th></tr></thead><tbody>';
  
  currencies.forEach(currency => {
    html += `<tr>
      <td>${currency.id}</td>
      <td>${currency.code}</td>
      <td>${currency.name}</td>
      <td>${currency.exchangeRate}</td>
      <td>
        <button class="btn-small" onclick="openEditCurrencyModal(${currency.id}, '${currency.code}', '${currency.name}', ${currency.exchangeRate})">Edit</button>
        <button class="btn-small btn-danger" onclick="deleteCurrency(${currency.id})">Delete</button>
      </td>
    </tr>`;
  });
  
  html += '</tbody></table>';
  document.getElementById('currenciesList').innerHTML = html;
}

// Load Summary
async function loadSummary() {
  try {
    const response = await fetch(`${API_BASE}/api/admin/summary`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (!response.ok) {
      console.error('Failed to load summary:', response.status);
      document.getElementById('summaryContent').innerHTML = '<p>Error loading summary</p>';
      return;
    }
    
    const summary = await response.json();
    displaySummary(summary);
  } catch (error) {
    console.error('Error loading summary:', error);
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

// Create User Modal Functions
function openCreateUserModal() {
  document.getElementById('createUserForm').reset();
  document.getElementById('createUserModal').style.display = 'block';
}

function closeCreateUserModal() {
  document.getElementById('createUserModal').style.display = 'none';
}

document.getElementById('createUserForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('createUsername').value;
  const email = document.getElementById('createEmail').value;
  const password = document.getElementById('createPassword').value;
  const role = document.getElementById('createRole').value;
  
  try {
    const response = await fetch(`${API_BASE}/api/auth/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ username, email, password, role })
    });
    
    if (response.ok) {
      closeCreateUserModal();
      loadUsers();
      alert('User created successfully');
    } else {
      const error = await response.text();
      alert('Error creating user: ' + error);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

// Create Trade Modal Functions
async function openCreateTradeModal() {
  document.getElementById('createTradeForm').reset();

  if (!usersCache.length) {
    await loadUsers();
  } else {
    populateTradeUserOptions(usersCache);
  }

  if (!currenciesCache.length) {
    await loadCurrencies();
  } else {
    populateTradeCurrencyOptions(currenciesCache);
  }

  document.getElementById('createTradeModal').style.display = 'block';
}

function closeCreateTradeModal() {
  document.getElementById('createTradeModal').style.display = 'none';
}

document.getElementById('createTradeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const fromCurrency = document.getElementById('createTradeFromCurrency').value;
  const toCurrency = document.getElementById('createTradeToCurrency').value;
  const amount = parseFloat(document.getElementById('createTradeAmount').value);
  const exchangeRate = parseFloat(document.getElementById('createTradeExchangeRate').value);
  const status = document.getElementById('createTradeStatus').value;
  const userId = parseInt(document.getElementById('createTradeUserId').value, 10);

  if (fromCurrency === toCurrency) {
    alert('From Currency and To Currency cannot be the same.');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/trades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ fromCurrency, toCurrency, amount, exchangeRate, status, userId })
    });
    
    if (response.ok) {
      closeCreateTradeModal();
      loadTrades();
      alert('Trade created successfully');
    } else {
      alert('Error creating trade');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

// Create Currency Modal Functions
function openCreateCurrencyModal() {
  document.getElementById('createCurrencyForm').reset();
  document.getElementById('createCurrencyModal').style.display = 'block';
}

function closeCreateCurrencyModal() {
  document.getElementById('createCurrencyModal').style.display = 'none';
}

document.getElementById('createCurrencyForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const code = document.getElementById('createCurrencyCode').value;
  const name = document.getElementById('createCurrencyName').value;
  const exchangeRate = parseFloat(document.getElementById('createCurrencyExchangeRate').value);
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/currencies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ code, name, exchangeRate })
    });
    
    if (response.ok) {
      closeCreateCurrencyModal();
      loadCurrencies();
      alert('Currency created successfully');
    } else {
      alert('Error creating currency');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

// Delete Functions
async function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return;
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (response.ok) {
      loadUsers();
      alert('User deleted successfully');
    } else {
      alert('Error deleting user');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function deleteTrade(tradeId) {
  if (!confirm('Are you sure you want to delete this trade?')) return;
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/trades/${tradeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (response.ok) {
      loadTrades();
      alert('Trade deleted successfully');
    } else {
      alert('Error deleting trade');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function deleteCurrency(currencyId) {
  if (!confirm('Are you sure you want to delete this currency?')) return;
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/currencies/${currencyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (response.ok) {
      loadCurrencies();
      alert('Currency deleted successfully');
    } else {
      alert('Error deleting currency');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

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

// Edit Currency Modal Functions
function openEditCurrencyModal(currencyId, code, name, exchangeRate) {
  document.getElementById('editCurrencyId').value = currencyId;
  document.getElementById('editCurrencyCode').value = code;
  document.getElementById('editCurrencyName').value = name;
  document.getElementById('editCurrencyExchangeRate').value = exchangeRate;
  document.getElementById('editCurrencyModal').style.display = 'block';
}

function closeCurrencyModal() {
  document.getElementById('editCurrencyModal').style.display = 'none';
}

document.getElementById('editCurrencyForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const currencyId = document.getElementById('editCurrencyId').value;
  const code = document.getElementById('editCurrencyCode').value;
  const name = document.getElementById('editCurrencyName').value;
  const exchangeRate = parseFloat(document.getElementById('editCurrencyExchangeRate').value);
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/currencies/${currencyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ code, name, exchangeRate })
    });
    
    if (response.ok) {
      closeCurrencyModal();
      loadCurrencies();
      alert('Currency updated successfully');
    } else {
      alert('Error updating currency');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

// Close modals when clicking outside
window.addEventListener('click', (event) => {
  const editUserModal = document.getElementById('editUserModal');
  const editTradeModal = document.getElementById('editTradeModal');
  const editCurrencyModal = document.getElementById('editCurrencyModal');
  const createUserModal = document.getElementById('createUserModal');
  const createTradeModal = document.getElementById('createTradeModal');
  const createCurrencyModal = document.getElementById('createCurrencyModal');
  
  if (event.target === editUserModal) {
    editUserModal.style.display = 'none';
  }
  if (event.target === editTradeModal) {
    editTradeModal.style.display = 'none';
  }
  if (event.target === editCurrencyModal) {
    editCurrencyModal.style.display = 'none';
  }
  if (event.target === createUserModal) {
    createUserModal.style.display = 'none';
  }
  if (event.target === createTradeModal) {
    createTradeModal.style.display = 'none';
  }
  if (event.target === createCurrencyModal) {
    createCurrencyModal.style.display = 'none';
  }
});

// Initial focus
document.getElementById('username').focus();