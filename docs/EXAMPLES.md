# Code Examples

Practical examples for common use cases in the Express Production Starter.

---

## Table of Contents

1. [Adding a New Feature](#adding-a-new-feature)
2. [Creating Custom Middleware](#creating-custom-middleware)
3. [File Upload Example](#file-upload-example)
4. [Caching Strategies](#caching-strategies)
5. [Custom Validators](#custom-validators)
6. [Background Jobs](#background-jobs)
7. [Testing Examples](#testing-examples)

---

## Adding a New Feature

Let's add a complete "Products" feature with CRUD operations.

### 1. Create Model

**`src/models/Product.js`**
```javascript
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'products',
    timestamps: true,
    underscored: true
  });
  
  return Product;
};
```

### 2. Update Models Index

**`src/models/index.js`**
```javascript
db.Product = require('./Product')(sequelize);
```

### 3. Create Migration

**`migrations/YYYYMMDDHHMMSS-create-products.js`**
```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      product_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
    
    await queryInterface.addIndex('products', ['name']);
    await queryInterface.addIndex('products', ['is_active']);
  },
  
  down: async (queryInterface) => {
    await queryInterface.dropTable('products');
  }
};
```

### 4. Create Service

**`src/services/productService.js`**
```javascript
const db = require('../models');
const { ApiError } = require('../middleware/errorHandler');
const cache = require('../utils/cache');
const { getPaginationParams, buildPaginationResponse } = require('../utils/pagination');

const getAll = async (query) => {
  const cacheKey = `products:all:${JSON.stringify(query)}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;
  
  const { page, limit, offset } = getPaginationParams(query);
  
  const whereClause = { is_active: true };
  
  if (query.search) {
    whereClause[db.Sequelize.Op.or] = [
      { name: { [db.Sequelize.Op.iLike]: `%${query.search}%` } },
      { description: { [db.Sequelize.Op.iLike]: `%${query.search}%` } }
    ];
  }
  
  const { count, rows } = await db.Product.findAndCountAll({
    where: whereClause,
    order: [['created_at', 'DESC']],
    limit,
    offset
  });
  
  const result = buildPaginationResponse(rows, count, page, limit);
  await cache.set(cacheKey, result, 300);
  
  return result;
};

const getById = async (productId) => {
  const product = await db.Product.findByPk(productId);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }
  return product;
};

const create = async (productData) => {
  const product = await db.Product.create(productData);
  await cache.clear();
  return product;
};

const update = async (productId, updateData) => {
  const product = await getById(productId);
  await product.update(updateData);
  await cache.clear();
  return product;
};

const remove = async (productId) => {
  const product = await getById(productId);
  await product.update({ is_active: false });
  await cache.clear();
  return { message: 'Product deleted successfully' };
};

module.exports = { getAll, getById, create, update, remove };
```

### 5. Create Routes

**`src/routes/products.js`**
```javascript
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const productService = require('../services/productService');
const ApiResponse = require('../utils/ApiResponse');
const { authenticateToken, requirePermission } = require('../middleware/auth');
const { validateBody, validateParams } = require('../middleware/validate');
const { asyncHandler } = require('../middleware/errorHandler');

const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(5000),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).default(0)
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(200),
  description: Joi.string().max(5000),
  price: Joi.number().positive(),
  stock: Joi.number().integer().min(0)
});

// Public routes
router.get('/', asyncHandler(async (req, res) => {
  const result = await productService.getAll(req.query);
  return ApiResponse.paginated(res, result.data, result.pagination);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const product = await productService.getById(req.params.id);
  return ApiResponse.success(res, product);
}));

// Protected routes
router.post('/',
  authenticateToken,
  requirePermission('products.create'),
  validateBody(createProductSchema),
  asyncHandler(async (req, res) => {
    const product = await productService.create(req.body);
    return ApiResponse.created(res, product);
  })
);

router.put('/:id',
  authenticateToken,
  requirePermission('products.update'),
  validateBody(updateProductSchema),
  asyncHandler(async (req, res) => {
    const product = await productService.update(req.params.id, req.body);
    return ApiResponse.success(res, product);
  })
);

router.delete('/:id',
  authenticateToken,
  requirePermission('products.delete'),
  asyncHandler(async (req, res) => {
    await productService.remove(req.params.id);
    return ApiResponse.deleted(res);
  })
);

module.exports = router;
```

### 6. Register Routes

**`src/routes/index.js`**
```javascript
router.use('/products', require('./products'));
```

### 7. Add Permissions

**`src/constants/permissions.js`**
```javascript
const PERMISSIONS = {
  // ... existing permissions
  'products.view': 'View products',
  'products.create': 'Create products',
  'products.update': 'Update products',
  'products.delete': 'Delete products'
};
```

---

## Creating Custom Middleware

### Request Timing Middleware

```javascript
// src/middleware/timing.js
const logger = require('../config/logger');

const timingMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    if (duration > 2000) {
      logger.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
    
    res.setHeader('X-Response-Time', `${duration}ms`);
  });
  
  next();
};

module.exports = { timingMiddleware };
```

### IP Whitelist Middleware

```javascript
// src/middleware/ipWhitelist.js
const { ApiError } = require('./errorHandler');
const logger = require('../config/logger');

const ipWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (!allowedIPs.includes(clientIP)) {
      logger.warn(`Blocked request from unauthorized IP: ${clientIP}`);
      throw ApiError.forbidden('Access denied');
    }
    
    next();
  };
};

module.exports = { ipWhitelist };
```

---

## File Upload Example

### Single File Upload

```javascript
// src/routes/upload.js
const express = require('express');
const router = express.Router();
const { upload, getFileUrl } = require('../utils/fileUpload');
const { authenticateToken } = require('../middleware/auth');
const ApiResponse = require('../utils/ApiResponse');
const { asyncHandler } = require('../middleware/errorHandler');

router.post('/avatar',
  authenticateToken,
  (req, res, next) => {
    req.uploadSubDir = 'avatars';
    req.allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    next();
  },
  upload.single('avatar'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw ApiError.badRequest('No file uploaded');
    }
    
    const fileUrl = getFileUrl(req.file.path);
    
    return ApiResponse.success(res, {
      filename: req.file.filename,
      url: fileUrl,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  })
);

module.exports = router;
```

### Multiple Files Upload

```javascript
router.post('/documents',
  authenticateToken,
  (req, res, next) => {
    req.uploadSubDir = 'documents';
    next();
  },
  upload.array('documents', 5),
  asyncHandler(async (req, res) => {
    const files = req.files.map(file => ({
      filename: file.filename,
      url: getFileUrl(file.path),
      size: file.size
    }));
    
    return ApiResponse.success(res, { files });
  })
);
```

---

## Caching Strategies

### Cache with TTL

```javascript
const getProductById = async (productId) => {
  const cacheKey = `product:${productId}`;
  
  // Try cache first
  const cached = await cache.get(cacheKey);
  if (cached) return cached;
  
  // Fetch from database
  const product = await db.Product.findByPk(productId);
  
  // Cache for 5 minutes
  await cache.set(cacheKey, product, 300);
  
  return product;
};
```

### Cache Invalidation

```javascript
const updateProduct = async (productId, updateData) => {
  const product = await db.Product.findByPk(productId);
  await product.update(updateData);
  
  // Invalidate specific cache
  await cache.del(`product:${productId}`);
  
  // Invalidate list cache
  await cache.del('products:all:*');
  
  return product;
};
```

### Cache Warming

```javascript
const warmCache = async () => {
  const popularProducts = await db.Product.findAll({
    where: { is_active: true },
    order: [['views', 'DESC']],
    limit: 100
  });
  
  for (const product of popularProducts) {
    await cache.set(`product:${product.product_id}`, product, 3600);
  }
};
```

---

## Custom Validators

### Phone Number Validator

```javascript
const Joi = require('joi');

const phoneValidator = Joi.extend((joi) => ({
  type: 'phone',
  base: joi.string(),
  messages: {
    'phone.invalid': '{{#label}} must be a valid phone number'
  },
  validate(value, helpers) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(value)) {
      return { value, errors: helpers.error('phone.invalid') };
    }
  }
}));

const schema = Joi.object({
  phone: phoneValidator.phone().required()
});
```

### Date Range Validator

```javascript
const dateRangeSchema = Joi.object({
  start_date: Joi.date().required(),
  end_date: Joi.date().min(Joi.ref('start_date')).required()
});
```

---

## Background Jobs

### Cron Job Example

```javascript
// src/cron/jobs.js
const cron = require('node-cron');
const logger = require('../config/logger');
const db = require('../models');

const initCronJobs = () => {
  // Run daily at 2 AM
  cron.schedule('0 2 * * *', async () => {
    logger.info('Running daily cleanup job...');
    
    try {
      // Delete old audit logs (older than 90 days)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      
      const deleted = await db.AuditLog.destroy({
        where: {
          created_at: {
            [db.Sequelize.Op.lt]: ninetyDaysAgo
          }
        }
      });
      
      logger.info(`Deleted ${deleted} old audit logs`);
    } catch (error) {
      logger.error('Cleanup job failed:', error);
    }
  });
  
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    logger.info('Running hourly cache cleanup...');
    // Cache cleanup logic
  });
};

module.exports = { initCronJobs };
```

---

## Testing Examples

### Unit Test Example

```javascript
// tests/unit/services/productService.test.js
const productService = require('../../../src/services/productService');
const db = require('../../../src/models');

jest.mock('../../../src/models');

describe('ProductService', () => {
  describe('getAll', () => {
    it('should return paginated products', async () => {
      const mockProducts = [
        { product_id: 1, name: 'Product 1' },
        { product_id: 2, name: 'Product 2' }
      ];
      
      db.Product.findAndCountAll = jest.fn().mockResolvedValue({
        count: 2,
        rows: mockProducts
      });
      
      const result = await productService.getAll({ page: 1, limit: 10 });
      
      expect(result.data).toEqual(mockProducts);
      expect(result.pagination.total).toBe(2);
    });
  });
});
```

### Integration Test Example

```javascript
// tests/integration/auth.test.js
const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/models');

describe('Auth API', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });
  
  afterAll(async () => {
    await db.sequelize.close();
  });
  
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!',
          full_name: 'Test User'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });
    
    it('should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!',
          full_name: 'Test User'
        });
      
      expect(res.statusCode).toBe(409);
    });
  });
});
```

---

For more examples, check the source code in the `src/` directory.
