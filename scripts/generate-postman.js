#!/usr/bin/env node

/**
 * Auto-generate Postman collection from API routes
 * Run: node scripts/generate-postman.js
 */

const fs = require('fs');
const path = require('path');

const collection = {
  info: {
    name: "Express Production Starter API",
    description: "Complete API collection - Auto-generated from routes",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    version: "1.0.0"
  },
  auth: {
    type: "bearer",
    bearer: [{ key: "token", value: "{{accessToken}}", type: "string" }]
  },
  variable: [
    { key: "baseUrl", value: "http://localhost:3001", type: "string" },
    { key: "accessToken", value: "", type: "string" },
    { key: "refreshToken", value: "", type: "string" }
  ],
  item: []
};

// Authentication folder
const authFolder = {
  name: "Authentication",
  item: [
    {
      name: "Register",
      event: [{
        listen: "test",
        script: {
          exec: [
            "if (pm.response.code === 201) {",
            "    const response = pm.response.json();",
            "    if (response.data && response.data.otp) {",
            "        pm.environment.set('otp', response.data.otp);",
            "        pm.environment.set('testEmail', pm.request.body.raw ? JSON.parse(pm.request.body.raw).email : '');",
            "    }",
            "}"
          ],
          type: "text/javascript"
        }
      }],
      request: {
        method: "POST",
        header: [{ key: "Content-Type", value: "application/json" }],
        body: {
          mode: "raw",
          raw: '{\n  "email": "user@example.com",\n  "password": "SecurePass123!",\n  "full_name": "John Doe"\n}'
        },
        url: {
          raw: "{{baseUrl}}/api/auth/register",
          host: ["{{baseUrl}}"],
          path: ["api", "auth", "register"]
        },
        description: "Register a new user. Returns OTP in response if SMTP is disabled."
      }
    },
    {
      name: "Verify OTP",
      event: [{
        listen: "test",
        script: {
          exec: [
            "if (pm.response.code === 200) {",
            "    const response = pm.response.json();",
            "    if (response.data) {",
            "        pm.environment.set('accessToken', response.data.accessToken);",
            "        pm.environment.set('refreshToken', response.data.refreshToken);",
            "        pm.collectionVariables.set('accessToken', response.data.accessToken);",
            "        pm.collectionVariables.set('refreshToken', response.data.refreshToken);",
            "    }",
            "}"
          ],
          type: "text/javascript"
        }
      }],
      request: {
        method: "POST",
        header: [{ key: "Content-Type", value: "application/json" }],
        body: {
          mode: "raw",
          raw: '{\n  "email": "{{testEmail}}",\n  "otp": "{{otp}}"\n}'
        },
        url: {
          raw: "{{baseUrl}}/api/auth/verify-otp",
          host: ["{{baseUrl}}"],
          path: ["api", "auth", "verify-otp"]
        }
      }
    },
    {
      name: "Login",
      event: [{
        listen: "test",
        script: {
          exec: [
            "if (pm.response.code === 200) {",
            "    const response = pm.response.json();",
            "    if (response.data) {",
            "        pm.environment.set('accessToken', response.data.accessToken);",
            "        pm.environment.set('refreshToken', response.data.refreshToken);",
            "        pm.collectionVariables.set('accessToken', response.data.accessToken);",
            "        pm.collectionVariables.set('refreshToken', response.data.refreshToken);",
            "    }",
            "}"
          ],
          type: "text/javascript"
        }
      }],
      request: {
        method: "POST",
        header: [{ key: "Content-Type", value: "application/json" }],
        body: {
          mode: "raw",
          raw: '{\n  "email": "admin@example.com",\n  "password": "Admin@123"\n}'
        },
        url: {
          raw: "{{baseUrl}}/api/auth/login",
          host: ["{{baseUrl}}"],
          path: ["api", "auth", "login"]
        }
      }
    },
    {
      name: "Refresh Token",
      request: {
        method: "POST",
        header: [{ key: "Content-Type", value: "application/json" }],
        body: {
          mode: "raw",
          raw: '{\n  "refreshToken": "{{refreshToken}}"\n}'
        },
        url: {
          raw: "{{baseUrl}}/api/auth/refresh",
          host: ["{{baseUrl}}"],
          path: ["api", "auth", "refresh"]
        }
      }
    },
    {
      name: "Logout",
      request: {
        method: "POST",
        header: [{ key: "Content-Type", value: "application/json" }],
        body: {
          mode: "raw",
          raw: '{\n  "refreshToken": "{{refreshToken}}"\n}'
        },
        url: {
          raw: "{{baseUrl}}/api/auth/logout",
          host: ["{{baseUrl}}"],
          path: ["api", "auth", "logout"]
        }
      }
    }
  ]
};

// Admin folder
const adminFolder = {
  name: "Admin - Roles & Permissions",
  item: [
    {
      name: "Get All Roles",
      request: {
        auth: { type: "bearer", bearer: [{ key: "token", value: "{{accessToken}}", type: "string" }] },
        method: "GET",
        url: {
          raw: "{{baseUrl}}/api/admin/roles?page=1&limit=10",
          host: ["{{baseUrl}}"],
          path: ["api", "admin", "roles"],
          query: [
            { key: "page", value: "1" },
            { key: "limit", value: "10" }
          ]
        }
      }
    },
    {
      name: "Create Role",
      request: {
        auth: { type: "bearer", bearer: [{ key: "token", value: "{{accessToken}}", type: "string" }] },
        method: "POST",
        header: [{ key: "Content-Type", value: "application/json" }],
        body: {
          mode: "raw",
          raw: '{\n  "role_name": "CUSTOM_ROLE",\n  "description": "Custom role description"\n}'
        },
        url: {
          raw: "{{baseUrl}}/api/admin/roles",
          host: ["{{baseUrl}}"],
          path: ["api", "admin", "roles"]
        }
      }
    },
    {
      name: "Update Role",
      request: {
        auth: { type: "bearer", bearer: [{ key: "token", value: "{{accessToken}}", type: "string" }] },
        method: "PUT",
        header: [{ key: "Content-Type", value: "application/json" }],
        body: {
          mode: "raw",
          raw: '{\n  "description": "Updated description"\n}'
        },
        url: {
          raw: "{{baseUrl}}/api/admin/roles/5",
          host: ["{{baseUrl}}"],
          path: ["api", "admin", "roles", "5"]
        }
      }
    },
    {
      name: "Get All Permissions",
      request: {
        auth: { type: "bearer", bearer: [{ key: "token", value: "{{accessToken}}", type: "string" }] },
        method: "GET",
        url: {
          raw: "{{baseUrl}}/api/admin/permissions",
          host: ["{{baseUrl}}"],
          path: ["api", "admin", "permissions"]
        }
      }
    },
    {
      name: "Get Permissions Grouped by Module",
      request: {
        auth: { type: "bearer", bearer: [{ key: "token", value: "{{accessToken}}", type: "string" }] },
        method: "GET",
        url: {
          raw: "{{baseUrl}}/api/admin/permissions/grouped",
          host: ["{{baseUrl}}"],
          path: ["api", "admin", "permissions", "grouped"]
        }
      }
    },
    {
      name: "Assign Permissions to Role",
      request: {
        auth: { type: "bearer", bearer: [{ key: "token", value: "{{accessToken}}", type: "string" }] },
        method: "POST",
        header: [{ key: "Content-Type", value: "application/json" }],
        body: {
          mode: "raw",
          raw: '{\n  "permission_ids": [1, 2, 3, 4, 5]\n}'
        },
        url: {
          raw: "{{baseUrl}}/api/admin/roles/5/permissions",
          host: ["{{baseUrl}}"],
          path: ["api", "admin", "roles", "5", "permissions"]
        }
      }
    },
    {
      name: "Remove Permission from Role",
      request: {
        auth: { type: "bearer", bearer: [{ key: "token", value: "{{accessToken}}", type: "string" }] },
        method: "DELETE",
        url: {
          raw: "{{baseUrl}}/api/admin/roles/5/permissions/1",
          host: ["{{baseUrl}}"],
          path: ["api", "admin", "roles", "5", "permissions", "1"]
        }
      }
    }
  ]
};

// Approval folder
const approvalFolder = {
  name: "Approval Workflow",
  item: [
    {
      name: "Get Pending Approvals",
      request: {
        auth: { type: "bearer", bearer: [{ key: "token", value: "{{accessToken}}", type: "string" }] },
        method: "GET",
        url: {
          raw: "{{baseUrl}}/api/approvals/pending?page=1&limit=10",
          host: ["{{baseUrl}}"],
          path: ["api", "approvals", "pending"],
          query: [
            { key: "page", value: "1" },
            { key: "limit", value: "10" }
          ]
        }
      }
    },
    {
      name: "Get My Approval Requests",
      request: {
        auth: { type: "bearer", bearer: [{ key: "token", value: "{{accessToken}}", type: "string" }] },
        method: "GET",
        url: {
          raw: "{{baseUrl}}/api/approvals/my-requests",
          host: ["{{baseUrl}}"],
          path: ["api", "approvals", "my-requests"]
        }
      }
    },
    {
      name: "Get Approval by ID",
      request: {
        auth: { type: "bearer", bearer: [{ key: "token", value: "{{accessToken}}", type: "string" }] },
        method: "GET",
        url: {
          raw: "{{baseUrl}}/api/approvals/1",
          host: ["{{baseUrl}}"],
          path: ["api", "approvals", "1"]
        }
      }
    },
    {
      name: "Approve Request",
      request: {
        auth: { type: "bearer", bearer: [{ key: "token", value: "{{accessToken}}", type: "string" }] },
        method: "POST",
        header: [{ key: "Content-Type", value: "application/json" }],
        body: {
          mode: "raw",
          raw: '{\n  "note": "Approved - looks good"\n}'
        },
        url: {
          raw: "{{baseUrl}}/api/approvals/1/approve",
          host: ["{{baseUrl}}"],
          path: ["api", "approvals", "1", "approve"]
        }
      }
    },
    {
      name: "Reject Request",
      request: {
        auth: { type: "bearer", bearer: [{ key: "token", value: "{{accessToken}}", type: "string" }] },
        method: "POST",
        header: [{ key: "Content-Type", value: "application/json" }],
        body: {
          mode: "raw",
          raw: '{\n  "note": "Rejected - does not meet requirements"\n}'
        },
        url: {
          raw: "{{baseUrl}}/api/approvals/1/reject",
          host: ["{{baseUrl}}"],
          path: ["api", "approvals", "1", "reject"]
        }
      }
    },
    {
      name: "Get Approval History",
      request: {
        auth: { type: "bearer", bearer: [{ key: "token", value: "{{accessToken}}", type: "string" }] },
        method: "GET",
        url: {
          raw: "{{baseUrl}}/api/approvals/history?page=1&limit=10",
          host: ["{{baseUrl}}"],
          path: ["api", "approvals", "history"],
          query: [
            { key: "page", value: "1" },
            { key: "limit", value: "10" }
          ]
        }
      }
    }
  ]
};

// Add all folders to collection
collection.item.push(authFolder);
collection.item.push(adminFolder);
collection.item.push(approvalFolder);

// Read existing collection to preserve user management folder
try {
  const existingPath = path.join(__dirname, '../postman/postman_collection.json');
  const existing = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
  
  // Find and preserve Users folder
  const usersFolder = existing.item.find(item => item.name === 'Users');
  if (usersFolder) {
    collection.item.push(usersFolder);
  }
  
  // Find and preserve Health folder
  const healthFolder = existing.item.find(item => item.name === 'Health');
  if (healthFolder) {
    collection.item.push(healthFolder);
  }
} catch (error) {
  console.log('Note: Could not read existing collection, creating new one');
}

// Write updated collection
const outputPath = path.join(__dirname, '../postman/postman_collection.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2));

console.log('✅ Postman collection generated successfully!');
console.log(`📁 Location: ${outputPath}`);
console.log('📊 Total APIs:', collection.item.reduce((sum, folder) => sum + folder.item.length, 0));
console.log('\n📝 To update collection:');
console.log('   npm run generate:postman');
console.log('\n📮 To import in Postman:');
console.log('   1. Open Postman');
console.log('   2. Click Import');
console.log('   3. Select postman/postman_collection.json');
