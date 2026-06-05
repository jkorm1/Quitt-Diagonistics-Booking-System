CREATE DATABASE IF NOT EXISTS quitt_diagnostics;
USE quitt_diagnostics;

-- 1. Dynamic Departments Table
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    max_concurrency INT NOT NULL DEFAULT 1,
    allows_home_service BOOLEAN DEFAULT FALSE,
    allows_pickup_service BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bookings Table
CREATE TABLE bookings (
    id VARCHAR(36) PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    dept_id INT NOT NULL,
    service_type ENUM('In-Clinic', 'Home-Service') DEFAULT 'In-Clinic',
     service_category ENUM('At-Home', 'Pickup') NULL, 
    location_address TEXT,
    problem_description TEXT,
    appointment_time DATETIME NOT NULL,
    status ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_dept FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE,
    INDEX idx_dept_time (dept_id, appointment_time),
    INDEX idx_status (status),
    INDEX idx_date ((DATE(appointment_time)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Staff Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Staff') DEFAULT 'Staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Initial Data
-- Seed Initial Data for Quitt Diagnostics
INSERT INTO departments (name, max_concurrency, allows_home_service, allows_pickup_service) VALUES
('Laboratory Services', 5, TRUE, TRUE),
('Ultrasound Scans', 3, FALSE, TRUE),
('Fluoroscopy Studies', 3, FALSE, TRUE),
('Mammogram', 3, FALSE, TRUE),
('X-rays of Any Part', 3, FALSE, TRUE),
('MRI & CT Scan', 3, FALSE, TRUE),
('General Consultation', 1, FALSE, TRUE);

-- Seed Admin User (password: admin123)
INSERT INTO users (username, password_hash, role) VALUES
('admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/ShO', 'Admin');
