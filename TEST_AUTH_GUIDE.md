# Authentication API Testing Guide

## Overview
This guide explains how to test the login and register APIs for the Taavoni application.

## Test File Location
`src/__tests__/auth.test.ts`

## How to Run Tests

### Method 1: Browser Console (Recommended)

1. Start the development server:
```bash
npm run dev
```

2. Open browser at `http://localhost:3000`

3. Open browser console (F12)

4. Import the test file in any page component or run directly:
```javascript
// Available test functions:
window.authTests.testLogin()
window.authTests.testRegister()
window.authTests.testVerifyOTP()
window.authTests.testGetProfile()
window.authTests.testLogout()
window.authTests.runAllAuthTests()
```

### Method 2: Create Test Page

Create `src/app/test-auth/page.tsx`:

```typescript
"use client";

import { useEffect } from "react";
import { testLogin, testRegister, testVerifyOTP } from "@/__tests__/auth.test";
import { Button, Container, Stack } from "@mui/material";

export default function TestAuthPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Button variant="contained" onClick={testRegister}>
          Test Register
        </Button>
        <Button variant="contained" onClick={testVerifyOTP}>
          Test Verify OTP
        </Button>
        <Button variant="contained" onClick={testLogin}>
          Test Login
        </Button>
      </Stack>
    </Container>
  );
}
```

Then visit: `http://localhost:3000/test-auth`

## Test Configuration

Before running tests, update test data in `src/__tests__/auth.test.ts`:

```typescript
const TEST_DATA = {
  login: {
    username: "YOUR_MOBILE_OR_EMAIL",
    password: "YOUR_PASSWORD"
  },
  
  register: {
    username: "YOUR_USERNAME",
    mobile: "09123456789",
    birth_year: 1380,
    birth_month: 6,
    birth_day: 15,
    password: "YOUR_PASSWORD",
    rules: true
  },
  
  otp: {
    mobile: "09123456789",
    code: "12345" // Update with SMS code
  }
};
```

## Test Scenarios

### 1. Test Registration Flow

```javascript
// Step 1: Register new user
await window.authTests.testRegister()
// Check SMS for OTP code

// Step 2: Update OTP code in test file, then verify
await window.authTests.testVerifyOTP()
```

### 2. Test Login Flow

```javascript
// Login with existing credentials
await window.authTests.testLogin()

// Get user profile
await window.authTests.testGetProfile()

// Logout
await window.authTests.testLogout()
```

### 3. Run All Tests

```javascript
// Runs register, login, profile, logout in sequence
await window.authTests.runAllAuthTests()
```

## Expected Results

### Successful Login
```
✅ Login Success: {
  token_type: "Bearer",
  expires_at: "2024-01-20T10:30:00Z",
  token_length: 500
}
```

### Successful Registration
```
✅ Register Success: true
📱 OTP sent to: 09123456789
```

### Failed Login (Wrong Credentials)
```
❌ Login Failed: {
  status: 401,
  message: "نام کاربری یا رمز عبور اشتباه است",
  errors: null
}
```

### Validation Error (422)
```
❌ Register Failed: {
  status: 422,
  message: "خطای اعتبارسنجی",
  errors: [
    { field: "mobile", message: "شماره موبایل تکراری است" }
  ]
}
```

## Birthday Picker Component

The register page now includes an improved birthday picker with:
- Persian month names (فروردین, اردیبهشت, etc.)
- Automatic day validation (31 days for months 1-6, 30 for 7-11, 29 for 12)
- Year dropdown (last 100 years)
- Better UX with dropdowns instead of text inputs

### Component Location
`src/components/BirthdayPicker.tsx`

### Usage
```typescript
import BirthdayPicker from "components/BirthdayPicker";

// Inside form with react-hook-form
<BirthdayPicker />
```

## Troubleshooting

### CORS Errors
Ensure API base URL is correct in `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=https://api.taavoni.online
```

### 401 Unauthorized
- Check if token is expired
- Try logging in again
- Clear localStorage and retry

### 422 Validation Error
- Check field requirements in error response
- Verify mobile number format (09XXXXXXXXX)
- Ensure password meets minimum length (6 characters)

### Network Error
- Check internet connection
- Verify API server is running
- Check browser network tab for details

## API Endpoints Being Tested

1. **POST /api/front/auth/register**
   - Registers new user
   - Sends OTP to mobile

2. **POST /api/front/auth/register/verify**
   - Verifies OTP code
   - Returns access token

3. **POST /api/front/auth/login**
   - Authenticates user
   - Returns access token

4. **GET /api/front/auth/profile**
   - Gets user profile
   - Requires authentication

5. **GET /api/front/auth/logout**
   - Logs out user
   - Clears token

## Next Steps

After successful testing:
1. ✅ Verify token storage in localStorage
2. ✅ Test auto-logout on 401 responses
3. ✅ Test session expiry handling
4. ✅ Verify user context updates
5. ✅ Test protected routes
