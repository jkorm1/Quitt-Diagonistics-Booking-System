# Setup Instructions - Quitt Diagnostics Booking System

## What You're Getting

A complete, production-ready appointment booking system for diagnostic services with:
- ✅ Dynamic capacity management
- ✅ Real-time slot availability
- ✅ Patient wizard (3 easy steps)
- ✅ Admin live queue dashboard
- ✅ Walk-in booking capability
- ✅ WhatsApp notification placeholders
- ✅ MySQL database with Docker

## Prerequisites

1. **Docker & Docker Compose**
   - macOS: Download Docker Desktop
   - Windows: Download Docker Desktop
   - Linux: `sudo apt-get install docker.io docker-compose`

2. **Node.js** (v18 or higher)
   - Download from nodejs.org

3. **Git** (optional, for cloning)

## Step-by-Step Setup

### Step 1: Navigate to Project Directory

```bash
cd your-project-directory
```

### Step 2: Start MySQL Database

```bash
docker-compose up -d
```

**Verify it's running:**
```bash
docker ps
```

You should see a container named `quitt_mysql` running.

### Step 3: Install Dependencies

```bash
pnpm install
# OR
npm install
# OR
yarn install
```

### Step 4: Start Development Server

```bash
pnpm dev
```

You'll see:
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## Access the System

### Patient Portal
**URL**: http://localhost:3000
- Book appointments with the 3-step wizard
- Select department, date/time, and enter patient info
- Receive WhatsApp confirmation (placeholder)

### Admin Dashboard
**URL**: http://localhost:3000/admin
- View today's appointment queue
- Check-in patients
- Cancel appointments
- Add walk-in bookings
- View appointment history

## Test Data

The system comes pre-loaded with:

**Departments:**
- Laboratory (max 5 concurrent, allows home service)
- Imaging (max 2 concurrent)
- General Consultation (max 3 concurrent)

**Admin User:** (for future authentication setup)
- Username: `admin`
- Password: `admin123`

## Common Issues & Solutions

### ❌ MySQL Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution:**
```bash
# Check if Docker is running
docker ps

# If not, start Docker Desktop or:
docker-compose down
docker-compose up -d

# Wait 10 seconds for MySQL to fully start
sleep 10

# Refresh your browser or restart Next.js
```

### ❌ Port 3000 Already in Use

```bash
# Stop the existing process or use a different port
pnpm dev -- -p 3001
```

### ❌ Dependencies Installation Failed

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### ❌ Database Schema Not Found

```bash
# Check if Docker container is healthy
docker logs quitt_mysql

# Reinitialize
docker-compose down
docker-compose up -d
sleep 15  # Wait for init script
```

## Database Inspection

### Connect to MySQL Directly

```bash
docker exec -it quitt_mysql mysql -u root -p
# Password: root

# In MySQL shell:
USE quitt_diagnostics;
SHOW TABLES;
SELECT * FROM departments;
SELECT * FROM bookings;
EXIT;
```

### View Docker Logs

```bash
docker logs quitt_mysql
docker logs -f quitt_mysql  # Follow logs
```

## Customization

### Change Department Capacity

Edit `init.sql` before first run, or update directly in MySQL:

```sql
UPDATE departments SET max_concurrency = 10 WHERE name = 'Laboratory';
```

### Modify Booking Hours

Edit `/lib/booking-service.ts`, function `getAvailableSlots`:

```typescript
const startHour = 8;    // Change start time
const endHour = 18;     // Change end time
```

### Adjust Slot Intervals

In the same function:

```typescript
for (let minute = 0; minute < 60; minute += 30) {  // Change 30 to 15, 60, etc.
```

### Setup WhatsApp Integration

Edit `/lib/booking-service.ts`, function `sendWhatsAppNotification`:

```typescript
async function sendWhatsAppNotification(phone: string, message: string) {
  // Add your WhatsApp API call here
  // Example: await whatsappClient.messages.create({ to: phone, body: message });
}
```

## Next Steps

1. **Deploy to Vercel:**
   - Push to GitHub
   - Connect to Vercel
   - Add environment variables in Vercel settings

2. **Add Authentication:**
   - Implement login for `/admin`
   - Use NextAuth.js or similar

3. **Implement WhatsApp API:**
   - Sign up for WhatsApp Business API
   - Add credentials to environment variables
   - Update `sendWhatsAppNotification` function

4. **Add Department Management UI:**
   - Create admin panel to add/edit departments
   - Add capacity management interface

5. **Production Setup:**
   - Move to managed MySQL database (AWS RDS, Supabase)
   - Update DATABASE_URL
   - Add proper authentication
   - Enable HTTPS
   - Set up monitoring/logging

## File Structure

```
/
├── app/
│   ├── page.tsx                 # Patient portal
│   ├── admin/page.tsx           # Admin dashboard
│   ├── api/
│   │   ├── bookings/route.ts    # Booking CRUD
│   │   ├── departments/route.ts # Get departments
│   │   ├── slots/route.ts       # Get available slots
│   │   └── queue/route.ts       # Live queue management
│   └── layout.tsx               # Root layout
├── components/
│   ├── booking-wizard.tsx       # Patient 3-step form
│   └── admin-dashboard.tsx      # Admin interface
├── lib/
│   ├── db.ts                    # MySQL connection pool
│   └── booking-service.ts       # Core business logic
├── docker-compose.yml           # MySQL container config
├── init.sql                     # Database schema
└── .env.local                   # Environment variables
```

## Stopping the System

```bash
# Stop the development server
Ctrl+C

# Stop Docker container
docker-compose down

# Stop and remove all data
docker-compose down -v
```

## Support & Troubleshooting

- Check `README.md` for feature documentation
- Review API endpoint specifications
- Inspect browser DevTools Network tab for API errors
- Check Next.js terminal for server-side errors
- Check Docker logs: `docker logs quitt_mysql`

---

**Ready to use!** Go to http://localhost:3000 to start booking appointments.
