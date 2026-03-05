-- Express Production Starter - Complete Database Schema
-- PostgreSQL Database Schema

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS action_logs CASCADE;
DROP TABLE IF EXISTS approval_requests CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_token_expires_at TIMESTAMP,
    refresh_token_version INTEGER DEFAULT 0,
    scheduled_deactivation_at TIMESTAMP,
    profile_photo VARCHAR(500),
    created_by INTEGER,
    updated_by INTEGER,
    deleted_by INTEGER,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_scheduled_deactivation ON users(scheduled_deactivation_at);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- Roles Table
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER,
    updated_by INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_roles_name ON roles(role_name);
CREATE INDEX idx_roles_system ON roles(is_system_role);
CREATE INDEX idx_roles_active ON roles(is_active);

-- Add foreign key constraint for users.role
ALTER TABLE users ADD CONSTRAINT fk_users_role 
    FOREIGN KEY (role) REFERENCES roles(role_id) ON DELETE SET NULL;

ALTER TABLE users ADD CONSTRAINT fk_users_created_by 
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL;

ALTER TABLE users ADD CONSTRAINT fk_users_updated_by 
    FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL;

ALTER TABLE users ADD CONSTRAINT fk_users_deleted_by 
    FOREIGN KEY (deleted_by) REFERENCES users(user_id) ON DELETE SET NULL;

-- Permissions Table
CREATE TABLE permissions (
    permission_id SERIAL PRIMARY KEY,
    permission_key VARCHAR(100) UNIQUE NOT NULL,
    permission_name VARCHAR(200) NOT NULL,
    module VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_permissions_key ON permissions(permission_key);
CREATE INDEX idx_permissions_module ON permissions(module);
CREATE INDEX idx_permissions_active ON permissions(is_active);

-- Role Permissions Table (Many-to-Many)
CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE,
    UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);

-- Refresh Tokens Table
CREATE TABLE refresh_tokens (
    token_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);
CREATE INDEX idx_refresh_tokens_revoked ON refresh_tokens(is_revoked);

-- OTPs Table
CREATE TABLE otps (
    otp_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    purpose VARCHAR(50) NOT NULL CHECK (purpose IN ('REGISTRATION', 'PASSWORD_RESET', 'EMAIL_VERIFICATION', 'OTHER')),
    expires_at TIMESTAMP NOT NULL,
    attempts INTEGER DEFAULT 0,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_otps_user ON otps(user_id);
CREATE INDEX idx_otps_expires ON otps(expires_at);
CREATE INDEX idx_otps_used ON otps(is_used);

-- Approval Requests Table
CREATE TABLE approval_requests (
    request_id SERIAL PRIMARY KEY,
    requested_by INTEGER NOT NULL,
    request_type VARCHAR(50) NOT NULL CHECK (request_type IN (
        'USER_CREATE', 'USER_UPDATE', 'USER_DELETE', 'USER_ROLE_CHANGE',
        'ROLE_CREATE', 'ROLE_UPDATE', 'ROLE_DELETE',
        'PERMISSION_ASSIGN', 'PERMISSION_REMOVE', 'OTHER'
    )),
    target_entity VARCHAR(100) NOT NULL,
    target_id INTEGER,
    old_values JSONB,
    new_values JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    approved_by INTEGER,
    approval_note TEXT,
    approved_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requested_by) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_approval_requests_requester ON approval_requests(requested_by);
CREATE INDEX idx_approval_requests_status ON approval_requests(status);
CREATE INDEX idx_approval_requests_type ON approval_requests(request_type);
CREATE INDEX idx_approval_requests_target ON approval_requests(target_entity, target_id);

-- Action Logs Table
CREATE TABLE action_logs (
    log_id BIGSERIAL PRIMARY KEY,
    user_id INTEGER,
    action_type VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100),
    entity_id INTEGER,
    request_method VARCHAR(10) NOT NULL,
    request_path VARCHAR(500) NOT NULL,
    request_body JSONB,
    request_query JSONB,
    response_status INTEGER,
    response_message TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    execution_time_ms INTEGER,
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_action_logs_user ON action_logs(user_id);
CREATE INDEX idx_action_logs_action ON action_logs(action_type);
CREATE INDEX idx_action_logs_module ON action_logs(module);
CREATE INDEX idx_action_logs_created ON action_logs(created_at);
CREATE INDEX idx_action_logs_method ON action_logs(request_method);
CREATE INDEX idx_action_logs_status ON action_logs(response_status);

-- Audit Logs Table
CREATE TABLE audit_logs (
    audit_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id INTEGER,
    changes JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Insert Initial Permissions
INSERT INTO permissions (permission_key, permission_name, module, description, is_active) VALUES
('users.view', 'View Users', 'users', 'View user list and details', true),
('users.create', 'Create Users', 'users', 'Create new users', true),
('users.update', 'Update Users', 'users', 'Update user information', true),
('users.delete', 'Delete Users', 'users', 'Delete users (soft delete)', true),
('users.activate', 'Activate Users', 'users', 'Activate user accounts', true),
('users.deactivate', 'Deactivate Users', 'users', 'Deactivate user accounts', true),
('users.export', 'Export Users', 'users', 'Export user data to Excel/PDF', true),
('users.schedule_deactivation', 'Schedule User Deactivation', 'users', 'Schedule automatic user deactivation', true),
('roles.view', 'View Roles', 'roles', 'View role list and details', true),
('roles.create', 'Create Roles', 'roles', 'Create custom roles', true),
('roles.update', 'Update Roles', 'roles', 'Update role information', true),
('roles.delete', 'Delete Roles', 'roles', 'Delete custom roles', true),
('roles.assign', 'Assign Roles', 'roles', 'Assign roles to users', true),
('permissions.view', 'View Permissions', 'permissions', 'View all available permissions', true),
('permissions.assign', 'Assign Permissions', 'permissions', 'Assign permissions to roles', true),
('permissions.remove', 'Remove Permissions', 'permissions', 'Remove permissions from roles', true),
('approval.view', 'View Approvals', 'approval', 'View pending approval requests', true),
('approval.allow', 'Bypass Approval', 'approval', 'Bypass approval workflow for actions', true),
('approval.approve', 'Approve Requests', 'approval', 'Approve pending requests', true),
('approval.reject', 'Reject Requests', 'approval', 'Reject pending requests', true),
('audit.view', 'View Audit Logs', 'audit', 'View audit log entries', true),
('audit.export', 'Export Audit Logs', 'audit', 'Export audit logs', true),
('action_logs.view', 'View Action Logs', 'action_logs', 'View action log entries', true),
('action_logs.export', 'Export Action Logs', 'action_logs', 'Export action logs', true),
('settings.view', 'View Settings', 'settings', 'View system settings', true),
('settings.update', 'Update Settings', 'settings', 'Update system settings', true),
('reports.view', 'View Reports', 'reports', 'View system reports', true),
('reports.create', 'Create Reports', 'reports', 'Create custom reports', true),
('reports.export', 'Export Reports', 'reports', 'Export reports to Excel/PDF', true);

-- Insert System Roles
INSERT INTO roles (role_name, description, is_system_role, is_active) VALUES
('SUPER_ADMIN', 'Super Administrator with full system access', true, true),
('ADMIN', 'Administrator with management access', true, true),
('MANAGER', 'Manager with limited administrative access', true, true),
('USER', 'Standard user with basic access', true, true);

-- Assign All Permissions to SUPER_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_name = 'SUPER_ADMIN';

-- Assign Permissions to ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
JOIN permissions p ON p.permission_key IN (
    'users.view', 'users.create', 'users.update', 'users.activate', 'users.deactivate', 
    'users.export', 'users.schedule_deactivation',
    'roles.view', 'roles.create', 'roles.update', 'roles.assign',
    'permissions.view', 'permissions.assign', 'permissions.remove',
    'approval.view', 'approval.allow', 'approval.approve', 'approval.reject',
    'audit.view', 'audit.export', 'action_logs.view',
    'settings.view', 'settings.update',
    'reports.view', 'reports.create', 'reports.export'
)
WHERE r.role_name = 'ADMIN';

-- Assign Permissions to MANAGER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
JOIN permissions p ON p.permission_key IN (
    'users.view', 'users.export',
    'roles.view', 'permissions.view', 'approval.view',
    'reports.view', 'reports.create', 'reports.export'
)
WHERE r.role_name = 'MANAGER';

-- Assign Permissions to USER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
JOIN permissions p ON p.permission_key IN ('users.view')
WHERE r.role_name = 'USER';

-- Create Default Super Admin User (password: Admin@123)
-- Note: Update this password hash after first login
INSERT INTO users (email, password_hash, full_name, role, is_active, email_verified)
SELECT 
    'admin@example.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWEHaSuu',
    'Super Administrator',
    role_id,
    true,
    true
FROM roles WHERE role_name = 'SUPER_ADMIN';

-- Comments
COMMENT ON TABLE users IS 'User accounts with authentication and profile information';
COMMENT ON TABLE roles IS 'Dynamic role definitions for RBAC';
COMMENT ON TABLE permissions IS 'All available system permissions';
COMMENT ON TABLE role_permissions IS 'Many-to-many relationship between roles and permissions';
COMMENT ON TABLE refresh_tokens IS 'JWT refresh tokens for authentication';
COMMENT ON TABLE approval_requests IS 'Pending approval requests for restricted actions';
COMMENT ON TABLE action_logs IS 'Comprehensive logging of all API actions';
COMMENT ON TABLE audit_logs IS 'Audit trail for sensitive operations';
