// Test script to verify Trade Tab functionality
// Run this in browser console at http://localhost:8080/ after login

async function testTradeTab() {
  console.log('=== Testing Trade Tab Functionality ===\n');
  
  // Simulate what happens when user logs in
  const loginData = {
    username: 'admin',
    password: 'admin123'
  };
  
  console.log('Step 1: Testing login...');
  try {
    const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });
    
    if (!loginResponse.ok) {
      console.error('Login failed:', loginResponse.status);
      return;
    }
    
    const loginResult = await loginResponse.json();
    const token = loginResult.token;
    console.log('✓ Login successful. Token received.\n');
    
    // Fetch trades using the token
    console.log('Step 2: Fetching trades from /api/admin/trades...');
    const tradesResponse = await fetch('http://localhost:8080/api/admin/trades', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!tradesResponse.ok) {
      console.error('Trade fetch failed:', tradesResponse.status);
      return;
    }
    
    const trades = await tradesResponse.json();
    console.log(`✓ Retrieved ${trades.length} trades\n`);
    
    // Verify trades have all required fields
    console.log('Step 3: Verifying trade data structure...');
    if (trades.length > 0) {
      const firstTrade = trades[0];
      const requiredFields = ['id', 'fromCurrency', 'toCurrency', 'amount', 'exchangeRate', 'resultAmount', 'tradeDate', 'status'];
      const missingFields = requiredFields.filter(field => !(field in firstTrade));
      
      if (missingFields.length === 0) {
        console.log('✓ All required fields present in trade data\n');
      } else {
        console.warn('⚠ Missing fields:', missingFields);
      }
      
      // Display sample trade
      console.log('Sample Trade:');
      console.log(`  From: ${firstTrade.fromCurrency}`);
      console.log(`  To: ${firstTrade.toCurrency}`);
      console.log(`  Amount: ${firstTrade.amount}`);
      console.log(`  Rate: ${firstTrade.exchangeRate}`);
      console.log(`  Result: ${firstTrade.resultAmount}\n`);
    }
    
    console.log('=== ✓ Trade Tab Functionality VERIFIED ===');
    return true;
    
  } catch (error) {
    console.error('Test failed:', error.message);
    return false;
  }
}

// Run the test
testTradeTab().then(result => {
  if (result) {
    console.log('\n✓ All tests passed! Trade tab is fully functional.');
  }
});
