const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Production Backend API',
      version: '1.0.0',
      description: 'Enterprise-grade Express.js backend with RBAC, security, and scalability built-in',
      contact: {
        name: 'API Support',
        email: 'support@yourcompany.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'https://api.yourcompany.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            user_id: {
              type: 'integer',
              description: 'User ID',
              example: 1
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com'
            },
            full_name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe'
            },
            role: {
              type: 'integer',
              description: 'Role ID',
              example: 4
            },
            userRole: {
              $ref: '#/components/schemas/Role'
            },
            is_active: {
              type: 'boolean',
              description: 'Account status',
              example: true
            },
            email_verified: {
              type: 'boolean',
              description: 'Email verification status',
              example: true
            },
            last_login_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last login timestamp',
              nullable: true
            },
            scheduled_deactivation_at: {
              type: 'string',
              format: 'date-time',
              description: 'Scheduled deactivation date',
              nullable: true
            },
            profile_photo: {
              type: 'string',
              description: 'Profile photo URL',
              nullable: true
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Role: {
          type: 'object',
          properties: {
            role_id: {
              type: 'integer',
              description: 'Role ID',
              example: 1
            },
            role_name: {
              type: 'string',
              description: 'Role name',
              example: 'ADMIN'
            },
            description: {
              type: 'string',
              description: 'Role description',
              nullable: true
            },
            is_system_role: {
              type: 'boolean',
              description: 'System role flag',
              example: true
            },
            is_active: {
              type: 'boolean',
              description: 'Role status',
              example: true
            }
          }
        },
        Permission: {
          type: 'object',
          properties: {
            permission_id: {
              type: 'integer',
              description: 'Permission ID',
              example: 1
            },
            permission_key: {
              type: 'string',
              description: 'Permission key',
              example: 'users.view'
            },
            permission_name: {
              type: 'string',
              description: 'Permission name',
              example: 'View Users'
            },
            module: {
              type: 'string',
              description: 'Module name',
              example: 'users'
            },
            description: {
              type: 'string',
              description: 'Permission description',
              nullable: true
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Login successful'
            },
            data: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                  description: 'JWT access token',
                  example: 'eyJhbGciOiJIUzI1NiIs...'
                },
                refreshToken: {
                  type: 'string',
                  description: 'JWT refresh token',
                  example: 'eyJhbGciOiJIUzI1NiIs...'
                },
                user: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          }
        },
        OTPResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Registration successful. Please verify your email with the OTP sent.'
            },
            data: {
              type: 'object',
              properties: {
                userId: {
                  type: 'integer',
                  example: 1
                },
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@example.com'
                },
                otp: {
                  type: 'string',
                  description: 'OTP (only in development mode)',
                  example: '123456'
                },
                devMode: {
                  type: 'boolean',
                  description: 'Development mode flag',
                  example: true
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message'
            },
            correlationId: {
              type: 'string',
              description: 'Request correlation ID'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Validation failed'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  },
                  type: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'array',
              items: {}
            },
            pagination: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer'
                },
                page: {
                  type: 'integer'
                },
                limit: {
                  type: 'integer'
                },
                totalPages: {
                  type: 'integer'
                },
                hasNext: {
                  type: 'boolean'
                },
                hasPrev: {
                  type: 'boolean'
                }
              }
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError'
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/modules/*/routes/*.js',
    './src/modules/*/controllers/*.js',
    './src/modules/*/validators/*.js',
    './src/models/*.js'
  ]
};

const specs = swaggerJsdoc(options);

const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Production Backend API Docs',
  customfavIcon: '/favicon.ico'
};

module.exports = {
  specs,
  swaggerUi,
  swaggerOptions
};
