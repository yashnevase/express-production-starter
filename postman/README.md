# 📮 Postman Collection Guide

## 🚀 Quick Import

### Method 1: Direct Import (Recommended)
```bash
1. Open Postman
2. Click "Import" button (top left)
3. Drag and drop: postman_collection.json
4. Click "Import"
```

### Method 2: From URL
```bash
1. Open Postman
2. Click "Import" → "Link"
3. Paste: https://raw.githubusercontent.com/your-repo/postman_collection.json
4. Click "Continue" → "Import"
```

## ✅ What's Included

### 20 Pre-configured API Requests

#### Authentication (9 endpoints)
- ✅ Register - Auto-saves OTP to environment
- ✅ Verify OTP - Auto-saves tokens
- ✅ Resend OTP
- ✅ Login - Auto-saves tokens
- ✅ Refresh Token - Auto-updates tokens
- ✅ Logout
- ✅ Forgot Password
- ✅ Reset Password
- ✅ Change Password

#### Users (11 endpoints)
- ✅ Get All Users (with filters)
- ✅ Get User by ID
- ✅ Create User
- ✅ Update User
- ✅ Delete User (soft delete)
- ✅ Activate User
- ✅ Deactivate User
- ✅ Schedule Deactivation
- ✅ Assign Role
- ✅ Export to Excel
- ✅ Export to PDF

#### Health (2 endpoints)
- ✅ Basic Health Check
- ✅ Detailed Health Check

## 🔧 Setup

### 1. Set Base URL
```bash
Collection Variables:
- baseUrl: http://localhost:3001 (default)
- accessToken: (auto-filled after login)
- refreshToken: (auto-filled after login)
```

### 2. Create Environment (Optional)
```bash
1. Click "Environments" (left sidebar)
2. Click "+" to create new environment
3. Add variables:
   - baseUrl: http://localhost:3001
   - testEmail: user@example.com
   - otp: (auto-filled)
   - accessToken: (auto-filled)
   - refreshToken: (auto-filled)
4. Select environment from dropdown
```

## 🎯 Quick Start Workflow

### Step 1: Start Server
```bash
npm run dev
```

### Step 2: Test Authentication Flow
```bash
1. Run "Login" request
   - Uses default admin: admin@example.com / Admin@123
   - Tokens auto-saved to variables

2. Run "Get All Users"
   - Uses saved accessToken automatically
   - See paginated user list
```

### Step 3: Test Registration Flow
```bash
1. Run "Register" request
   - OTP auto-saved to environment (if SMTP disabled)
   
2. Run "Verify OTP" request
   - Uses saved OTP and email
   - Tokens auto-saved

3. Run "Get All Users"
   - See your new user in the list
```

## 🔄 Auto-Update Features

### Automatic Token Management
All requests automatically:
1. **Save tokens** after login/register/verify
2. **Use saved tokens** for authenticated requests
3. **Update tokens** after refresh

### Post-Request Scripts
```javascript
// Example: Login request auto-saves tokens
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set('accessToken', response.data.accessToken);
    pm.environment.set('refreshToken', response.data.refreshToken);
}
```

## 📝 How to Use

### 1. Authentication Required Requests
```bash
All user endpoints require authentication.
Token is automatically added from collection variable.

If you get 401 Unauthorized:
1. Run "Login" request first
2. Or run "Refresh Token" if token expired
```

### 2. Testing Different Roles
```bash
Default Users (from seeders):
- admin@example.com / Admin@123 (SUPER_ADMIN - all permissions)

Test different permissions:
1. Login as admin
2. Create user with different role
3. Login as new user
4. Test permission-restricted endpoints
```

### 3. Testing Filters
```bash
Get All Users with filters:
- Enable query params in request
- Set values:
  - role: ADMIN, MANAGER, USER
  - is_active: true/false
  - search: john
  - page: 1
  - limit: 10
```

### 4. File Downloads (Excel/PDF)
```bash
1. Run "Export Users to Excel" or "Export Users to PDF"
2. Postman will prompt to save file
3. Choose location and save
4. Open in Excel/PDF viewer
```

## 🎨 Customization

### Change Base URL
```bash
For Production:
1. Click collection → Variables
2. Change baseUrl to: https://api.yourcompany.com
3. Save
```

### Add Custom Headers
```bash
1. Click request → Headers tab
2. Add new header:
   - Key: X-Custom-Header
   - Value: custom-value
```

### Modify Request Body
```bash
1. Click request → Body tab
2. Edit JSON:
   {
     "email": "your-email@example.com",
     "password": "YourPassword123!"
   }
3. Send request
```

## 🔍 Testing Scenarios

### Scenario 1: Complete User Registration
```bash
1. Register → Get OTP in response (dev mode)
2. Verify OTP → Get tokens
3. Get All Users → See your user
4. Change Password → Update password
5. Logout → Revoke tokens
6. Login → Login with new password
```

### Scenario 2: User Management
```bash
1. Login as admin
2. Create User → New user created
3. Get User by ID → View details
4. Update User → Modify details
5. Assign Role → Change role
6. Deactivate User → Disable account
7. Activate User → Re-enable account
```

### Scenario 3: Scheduled Deactivation
```bash
1. Login as admin
2. Schedule Deactivation → Set future date
3. Get User by ID → See scheduled_deactivation_at
4. Wait for cron job (or manually trigger)
5. Get User by ID → User is deactivated
```

### Scenario 4: Export Data
```bash
1. Login as admin
2. Export to Excel → Download .xlsx file
3. Export to PDF → Download .pdf file
4. Open files → View formatted data
```

## 🐛 Troubleshooting

### Issue: 401 Unauthorized
```bash
Solution:
1. Run "Login" request
2. Check accessToken is saved in variables
3. Verify Authorization header is set to Bearer {{accessToken}}
```

### Issue: 403 Forbidden
```bash
Solution:
1. Check user has required permission
2. Login as admin (has all permissions)
3. Verify role has permission in database
```

### Issue: OTP not saved
```bash
Solution:
1. Check ENABLE_SMTP=false in .env
2. Run Register request
3. Check Tests tab → Should save OTP to environment
4. View environment variables → otp should be set
```

### Issue: Tokens not auto-saved
```bash
Solution:
1. Create environment (if not exists)
2. Select environment from dropdown
3. Run Login request
4. Check environment variables → tokens should be set
```

### Issue: File download not working
```bash
Solution:
1. Ensure server is running
2. Check user has users.export permission
3. Click "Send and Download" button
4. Choose save location
```

## 📊 Collection Variables

### Available Variables
```javascript
{{baseUrl}}        // Server URL (default: http://localhost:3001)
{{accessToken}}    // JWT access token (auto-filled)
{{refreshToken}}   // JWT refresh token (auto-filled)
{{testEmail}}      // Test user email (auto-filled after register)
{{otp}}            // OTP code (auto-filled in dev mode)
```

### Using Variables
```javascript
// In URL
{{baseUrl}}/api/users

// In Headers
Authorization: Bearer {{accessToken}}

// In Body
{
  "email": "{{testEmail}}",
  "otp": "{{otp}}"
}
```

## 🔄 Keeping Collection Updated

### Auto-Update (Future Feature)
The collection is generated from your API routes. When you add new endpoints:

1. **Manual Update** (Current):
   - Edit `postman_collection.json`
   - Add new request following existing pattern
   - Re-import in Postman

2. **Auto-Generate** (Future):
   ```bash
   npm run generate:postman
   # Generates updated collection from routes
   ```

## 🎉 Benefits

### vs Manual Testing
- ✅ **20+ requests** pre-configured
- ✅ **Auto token management** no copy-paste
- ✅ **Organized folders** easy navigation
- ✅ **Example data** ready to test
- ✅ **One-click import** instant setup

### vs Swagger UI
- ✅ **Offline testing** no server needed
- ✅ **Request history** track all tests
- ✅ **Collections** organize by feature
- ✅ **Environments** switch dev/staging/prod
- ✅ **Team sharing** export/import easily

### vs Writing cURL
- ✅ **GUI interface** no command line
- ✅ **Auto-complete** less typing
- ✅ **Visual responses** formatted JSON
- ✅ **Save requests** reuse anytime
- ✅ **Scripts** automate workflows

## 📚 Additional Resources

### Postman Documentation
- [Importing Collections](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/)
- [Using Variables](https://learning.postman.com/docs/sending-requests/variables/)
- [Writing Tests](https://learning.postman.com/docs/writing-scripts/test-scripts/)

### Collection Features
- Pre-request scripts for setup
- Post-request tests for validation
- Environment variables for flexibility
- Authorization inheritance from collection

## 🎯 Summary

**One Import = 20+ Working APIs**

```bash
1. Import postman_collection.json
2. Run "Login" request
3. Test any endpoint
4. Tokens managed automatically
5. Download Excel/PDF exports
6. Share with team
```

**No configuration needed. Just import and test!** 🚀
