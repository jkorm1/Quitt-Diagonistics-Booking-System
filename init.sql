-- 1. Dynamic Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    max_concurrency INT NOT NULL DEFAULT 1,
    allows_home_service BOOLEAN DEFAULT FALSE,
    allows_pickup_service BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dept_id INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_service_dept FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(36) PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    dept_id INT NOT NULL,
    service_id INT NULL,
    service_type ENUM('In-Clinic', 'Home-Service') DEFAULT 'In-Clinic',
    service_category ENUM('At-Home', 'Pickup') NULL,
    location_address TEXT,
    problem_description TEXT,
    prescription_image VARCHAR(255) NULL,
    appointment_time DATETIME NOT NULL,
    status ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_dept FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE CASCADE,
    CONSTRAINT fk_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
    INDEX idx_dept_time (dept_id, appointment_time),
    INDEX idx_status (status),
    INDEX idx_date ((DATE(appointment_time)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Staff Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Staff') DEFAULT 'Staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Initial Data
INSERT IGNORE INTO departments (name, max_concurrency, allows_home_service, allows_pickup_service) VALUES
('Ultrasound Services', 3, FALSE, TRUE),
('Mammogram Services', 3, FALSE, TRUE),
('CT Scan Services', 3, FALSE, TRUE),
('Laboratory Services', 5, TRUE, TRUE),
('Electrocardiogram (ECG)', 3, FALSE, TRUE),
('Other Services', 3, FALSE, TRUE);

-- Ultrasound Services
INSERT IGNORE INTO services (name, dept_id) VALUES
('Abdominal Ultrasound', 1),
('Obstetrics Scan', 1),
('Breast Scan', 1),
('Doppler Scan for Limbs', 1),
('Fetal Anomaly Scan', 1),
('Gynaecological Scan', 1);

-- Mammogram Services
INSERT IGNORE INTO services (name, dept_id) VALUES
('General Mammogram Services', 2);

-- CT Scan Services
INSERT IGNORE INTO services (name, dept_id) VALUES
('General CT Scan Services', 3);

-- Laboratory Services
INSERT IGNORE INTO services (name, dept_id) VALUES
('Cardiac Profile', 4),
('LFT (Liver Function Test)', 4),
('RFT (Renal Function Test)', 4),
('Lipid Profile', 4);

-- Electrocardiogram (ECG)
INSERT IGNORE INTO services (name, dept_id) VALUES
('Electrocardiogram (ECG) Testing', 5);

-- Other Services
INSERT IGNORE INTO services (name, dept_id) VALUES
('Plain X-Ray Reporting', 6),
('Fluoroscopy Studies Reporting', 6),
('Mammogram Reporting', 6),
('CT Scan Reporting', 6),
('MRI Reporting', 6);

-- Seed Admin User (password: admin123)
INSERT IGNORE INTO users (username, password_hash, role) VALUES
('admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/ShO', 'Admin');

INSERT IGNORE INTO users (username, password_hash, role) VALUES
('staff', '$2b$10$W3ZvZGVtZGVtb25zdHJhdGlvbi5jb20uY2hhcmlzd29yZC5vcmc', 'Staff');