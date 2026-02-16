import { authService } from "@/services/auth.service";
import type { LoginRequest, RegisterRequest, VerifyOtpRequest } from "@/types/auth.types";

/**
 * Authentication API Tests
 * 
 * Run these tests manually to verify API integration:
 * 1. Update credentials with real test data
 * 2. Run each test function individually
 * 3. Check console output for results
 */

// Test data - UPDATE THESE WITH REAL TEST CREDENTIALS
const TEST_DATA = {
  login: {
    username: "1234567890", // Iranian national code (کد ملی)
    password: "test123456"
  } as LoginRequest,
  
  register: {
    username: "1234567890", // Iranian national code (کد ملی)
    mobile: "09123456789",
    birth_year: 1380,
    birth_month: 6,
    birth_day: 15,
    password: "test123456",
    rules: true
  } as RegisterRequest,
  
  otp: {
    mobile: "09123456789",
    code: "12345" // Will be sent via SMS
  } as VerifyOtpRequest
};

/**
 * Test 1: Login API
 * Expected: Returns access_token, token_type, expires_at
 */
export async function testLogin() {
  console.log("🧪 Testing Login API...");
  try {
    const result = await authService.login(TEST_DATA.login);
    console.log("✅ Login Success:", {
      token_type: result.token_type,
      expires_at: result.expires_at,
      token_length: result.access_token.length
    });
    return result;
  } catch (error: any) {
    console.error("❌ Login Failed:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      errors: error.response?.data?.data
    });
    throw error;
  }
}

/**
 * Test 2: Register API
 * Expected: Returns true and sends OTP to mobile
 */
export async function testRegister() {
  console.log("🧪 Testing Register API...");
  try {
    const result = await authService.register(TEST_DATA.register);
    console.log("✅ Register Success:", result);
    console.log("📱 OTP sent to:", TEST_DATA.register.mobile);
    return result;
  } catch (error: any) {
    console.error("❌ Register Failed:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      errors: error.response?.data?.data
    });
    throw error;
  }
}

/**
 * Test 3: Verify OTP API
 * Expected: Returns access_token after successful verification
 * Note: Run testRegister() first to get OTP code
 */
export async function testVerifyOTP() {
  console.log("🧪 Testing Verify OTP API...");
  console.log("⚠️  Make sure to update TEST_DATA.otp.code with the SMS code");
  try {
    const result = await authService.verifyOTP(TEST_DATA.otp);
    console.log("✅ OTP Verification Success:", {
      token_type: result.token_type,
      expires_at: result.expires_at,
      token_length: result.access_token.length
    });
    return result;
  } catch (error: any) {
    console.error("❌ OTP Verification Failed:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      errors: error.response?.data?.data
    });
    throw error;
  }
}

/**
 * Test 4: Get Profile API
 * Expected: Returns user profile data
 * Note: Must be logged in first
 */
export async function testGetProfile() {
  console.log("🧪 Testing Get Profile API...");
  try {
    const result = await authService.getProfile();
    console.log("✅ Get Profile Success:", {
      username: result.username,
      mobile: result.mobile,
      status: result.status_label
    });
    return result;
  } catch (error: any) {
    console.error("❌ Get Profile Failed:", {
      status: error.response?.status,
      message: error.response?.data?.message
    });
    throw error;
  }
}

/**
 * Test 5: Logout API
 * Expected: Clears token and logs out user
 */
export async function testLogout() {
  console.log("🧪 Testing Logout API...");
  try {
    await authService.logout();
    console.log("✅ Logout Success");
  } catch (error: any) {
    console.error("❌ Logout Failed:", {
      status: error.response?.status,
      message: error.response?.data?.message
    });
    throw error;
  }
}

/**
 * Run all tests in sequence
 * Usage: Import and call this function from browser console or test runner
 */
export async function runAllAuthTests() {
  console.log("🚀 Starting Authentication API Tests...\n");
  
  try {
    // Test 1: Register
    console.log("\n--- Test 1: Register ---");
    await testRegister();
    console.log("⏸️  Paused - Please check SMS for OTP code");
    console.log("📝 Update TEST_DATA.otp.code and run testVerifyOTP()");
    
    // Test 2: Verify OTP (manual - requires SMS code)
    // await testVerifyOTP();
    
    // Test 3: Login
    console.log("\n--- Test 2: Login ---");
    await testLogin();
    
    // Test 4: Get Profile
    console.log("\n--- Test 3: Get Profile ---");
    await testGetProfile();
    
    // Test 5: Logout
    console.log("\n--- Test 4: Logout ---");
    await testLogout();
    
    console.log("\n✅ All tests completed!");
  } catch (error) {
    console.log("\n❌ Test suite failed");
  }
}

// Export for browser console testing
if (typeof window !== "undefined") {
  (window as any).authTests = {
    testLogin,
    testRegister,
    testVerifyOTP,
    testGetProfile,
    testLogout,
    runAllAuthTests
  };
  console.log("🔧 Auth tests loaded. Use window.authTests to run tests");
}
