import https from 'https';
import axios from 'axios';

const BASE_URL = 'https://api.taavoni.online/api/front';
const PRODUCT_CODE = 'TP-00001010';

// Test 1: Product endpoint with basic auth
async function testProductWithAuth() {
  console.log('\n=== Test 1: Product with Basic Auth ===');
  console.log('URL:', `${BASE_URL}/products/${PRODUCT_CODE}`);
  try {
    const response = await axios.get(`${BASE_URL}/products/${PRODUCT_CODE}`, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      auth: { username: 'test', password: '1qaz2wsx' }
    });
    console.log('✅ Success:', response.data.success, response.data.data?.title);
  } catch (error: any) {
    console.log('❌ Error:', error.message);
  }
}

// Test 2: Multiple product requests
async function testMultipleProducts() {
  console.log('\n=== Test 2: Multiple Product Requests ===');
  try {
    const requests = Array(5).fill(null).map(() => 
      axios.get(`${BASE_URL}/products/${PRODUCT_CODE}`, {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        auth: { username: 'test', password: '1qaz2wsx' }
      })
    );
    const results = await Promise.all(requests);
    console.log('✅ Success: All', results.length, 'requests completed');
  } catch (error: any) {
    console.log('❌ Error:', error.message);
  }
}

// Test 3: Product with keepAlive
async function testProductKeepAlive() {
  console.log('\n=== Test 3: Product with keepAlive ===');
  try {
    const response = await axios.get(`${BASE_URL}/products/${PRODUCT_CODE}`, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false, keepAlive: true }),
      auth: { username: 'test', password: '1qaz2wsx' }
    });
    console.log('✅ Success:', response.data.success);
  } catch (error: any) {
    console.log('❌ Error:', error.message);
  }
}

// Test 4: Product without keepAlive
async function testProductNoKeepAlive() {
  console.log('\n=== Test 4: Product without keepAlive ===');
  try {
    const response = await axios.get(`${BASE_URL}/products/${PRODUCT_CODE}`, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false, keepAlive: false }),
      auth: { username: 'test', password: '1qaz2wsx' }
    });
    console.log('✅ Success:', response.data.success);
  } catch (error: any) {
    console.log('❌ Error:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('Testing Taavoni API Product Endpoint...\n');
  await testProductWithAuth();
  await testMultipleProducts();
  await testProductKeepAlive();
  await testProductNoKeepAlive();
  console.log('\n=== Tests Complete ===\n');
}

runTests();
