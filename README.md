# Quitt Diagnostics - Booking & Scheduling System

A modern, clean booking system for diagnostic services with real-time capacity management, built with Next.js 14, TypeScript, MySQL, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- pnpm (or npm/yarn)

### 1. Start MySQL Database

```bash
docker-compose up -d
```

This will:
- Spin up a MySQL 8.0 container
- Create the `quitt_diagnostics` database
- Initialize tables and seed initial data

Verify the database is running:
```bash
docker ps
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Features

### Patient Portal (`/`)
- **3-Step Booking Wizard**
  - Step 1: Department Selection (Laboratory, Imaging, General Consultation)
  - Step 2: Date & Time Selection with Real-Time Availability
  - Step 3: Patient Information & Service Type
- **Home Service Support** for Laboratory department
- **Dynamic Slot Management** based on department capacity
- **WhatsApp Notifications** (placeholder for API integration)

### Admin Dashboard (`/admin`)
- **Live Queue Management**
  - View today's pending appointments in real-time
  - Check-in patients with one click
  - Cancel appointments
  - View patient location/address for home services
  
- **Walk-In Booking**
  - Quick manual booking without notice period
  - Immediate addition to queue

- **Appointment History**
  - View completed appointments
  - Track daily throughput

## 🏗️ Architecture

### Database Schema
```
departments
├── id (PK)
├── name
├── max_concurrency (dynamic capacity)
├── allows_home_service

bookings
├── id (PK) UUID
├── patient_name
├── phone_number
├── dept_id (FK)
├── service_type (In-Clinic | Home-Service)
├── location_address (for home service)
├── appointment_time
├── status (Pending | Completed | Cancelled)

users
├── id (PK)
├── username
├── password_hash
├── role (Admin | Staff)
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/departments` | GET | Fetch all departments |
| `/api/bookings` | POST | Create new booking |
| `/api/bookings` | GET | Fetch bookings by date |
| `/api/slots` | GET | Get available time slots |
| `/api/queue` | GET | Get today's appointments |
| `/api/queue` | PATCH | Update booking status |

### Core Business Logic

**Concurrency Engine**
- Before confirming a booking, the system checks:
  ```
  Current_Pending_Bookings < Department_Max_Concurrency
  ```
- Each department has configurable `max_concurrency`
- Time slots are 30-minute intervals (08:00 - 18:00)

## 🔧 Configuration

Edit `.env.local` to customize:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=quitt_diagnostics

# Future WhatsApp Integration
# WHATSAPP_API_KEY=your_api_key
# WHATSAPP_PHONE_ID=your_phone_id
```

## 📊 Updating Department Capacity

Edit the database directly or create an admin panel. Example:

```sql
UPDATE departments SET max_concurrency = 5 WHERE name = 'Imaging';
```

## 🎨 Design System

- **Primary Color**: Lightning Blue (#007BFF)
- **Background**: White (#FFFFFF) & Light Slate (#F8FAFC)
- **Style**: Modern, clinical, rounded corners, soft shadows
- **Responsive**: Mobile-first design optimized for all devices

## 📱 Tech Stack

- **Frontend**: React 19 + Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: MySQL 8.0
- **Backend**: Next.js API Routes
- **ORM**: Raw mysql2 queries (kept simple)

## 🧪 Testing

Once running, test the flow:

1. Go to [http://localhost:3000](http://localhost:3000)
2. Book an appointment through the wizard
3. Go to [http://localhost:3000/admin](http://localhost:3000/admin) to see the queue
4. Test check-in and cancellation

## 🔐 Security Notes

- Production: Implement proper authentication for `/admin`
- Validate all inputs on backend
- Use environment variables for sensitive data
- Enable HTTPS in production
- Consider adding rate limiting for API endpoints

## 📈 Future Enhancements

- [ ] WhatsApp API integration for real notifications
- [ ] SMS reminders 24 hours before appointment
- [ ] Admin authentication & role-based access
- [ ] Department manager UI (add/edit departments)
- [ ] Reporting and analytics
- [ ] Multi-location support
- [ ] Staff assignment and scheduling
- [ ] Cancellation reasons tracking

## 📞 Support

For issues or questions:
1. Check database connectivity: `docker logs quitt_mysql`
2. Verify `.env.local` configuration
3. Check Next.js logs in terminal
4. Inspect API responses in browser DevTools

## 📄 License

Built for Quitt Diagnostics - All rights reserved.
