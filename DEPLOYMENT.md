# Deployment Checklist - Quitt Diagnostics

## Pre-Deployment (Before Going Live)

### ✅ Security Hardening

- [ ] **Admin Authentication**
  - Implement login for `/admin` route
  - Use NextAuth.js or Auth.js
  - Hash passwords with bcrypt (already imported)
  - Add JWT tokens with expiration

- [ ] **API Security**
  - Add rate limiting (express-rate-limit or similar)
  - Enable CORS appropriately
  - Validate and sanitize all inputs
  - Add request logging

- [ ] **Database Security**
  - Change MySQL root password (not "root")
  - Create database user with limited privileges
  - Enable SSL for database connections
  - Enable automated backups

- [ ] **Environment Variables**
  - Remove all credentials from code
  - Use .env.local for development only
  - Add to .gitignore (already done)
  - Document all required variables

### ✅ Performance

- [ ] **Database Optimization**
  - Verify all indexes exist (already added)
  - Run ANALYZE TABLE on each table
  - Monitor slow query log

- [ ] **API Optimization**
  - Test with concurrent users (load testing)
  - Add caching for departments (fetched often)
  - Consider pagination for large result sets

- [ ] **Frontend Optimization**
  - Enable image optimization (Next.js default)
  - Check Core Web Vitals
  - Minify and compress assets (automatic in Next.js)

### ✅ Testing

- [ ] **Functional Testing**
  - Test patient booking flow end-to-end
  - Verify capacity limits work
  - Test walk-in bookings
  - Test cancellation and check-in
  - Test with multiple concurrent users

- [ ] **Edge Cases**
  - Test booking at exactly capacity (should fail)
  - Test overbooking attempts
  - Test with special characters in names
  - Test with invalid phone numbers

- [ ] **Browser Testing**
  - Chrome/Edge (latest)
  - Firefox (latest)
  - Safari (iOS)
  - Mobile browsers

### ✅ Documentation

- [ ] Update README with your custom details
- [ ] Document department list
- [ ] Document operating hours
- [ ] Create user manuals for staff
- [ ] Create FAQ for patients

---

## Deployment to Vercel

### Step 1: Prepare Repository

```bash
# Initialize git if not done
git init
git add .
git commit -m "Initial commit: Quitt Diagnostics"

# Push to GitHub
git remote add origin https://github.com/your-org/quitt-diagnostics.git
git push -u origin main
```

### Step 2: Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"
5. Configure project name and settings
6. Click "Deploy"

### Step 3: Set Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```
DB_HOST = your-mysql-host.region.rds.amazonaws.com
DB_PORT = 3306
DB_USER = quitt_admin
DB_PASSWORD = [strong-password]
DB_NAME = quitt_diagnostics
```

**For Production MySQL (AWS RDS Example):**
```bash
DB_HOST = quitt-diagnostics-prod.cxxx.us-east-1.rds.amazonaws.com
DB_USER = quitt_app_user
DB_PASSWORD = [32-char-random-password]
```

### Step 4: Verify Deployment

1. Wait for build to complete (usually 2-3 minutes)
2. Visit your Vercel URL
3. Test patient booking flow
4. Test admin dashboard at `/admin`
5. Check database connection in logs

---

## Database Migration to Production

### Option A: AWS RDS MySQL

```bash
# 1. Create RDS instance in AWS Console
# 2. Set security group to allow your app IP
# 3. Download your init.sql
# 4. Connect and initialize:

mysql -h your-rds-endpoint.rds.amazonaws.com -u admin -p < init.sql

# 5. Update environment variables in Vercel
```

### Option B: Supabase (PostgreSQL)

```bash
# 1. Create Supabase project
# 2. Convert init.sql to PostgreSQL syntax
# 3. Run in SQL editor
# 4. Update code for PostgreSQL if needed
# 5. Update connection string
```

### Option C: DigitalOcean Managed Database

```bash
# 1. Create managed MySQL database
# 2. Configure firewall rules
# 3. Get connection string
# 4. Initialize schema
# 5. Update env vars
```

---

## Monitoring & Maintenance

### Daily Checks

- [ ] Monitor error logs in Vercel
- [ ] Check database connection health
- [ ] Verify appointments are being created
- [ ] Monitor admin dashboard usage

### Weekly Checks

- [ ] Review booking statistics
- [ ] Check for failed API requests
- [ ] Verify backup jobs running
- [ ] Monitor response times

### Monthly Tasks

- [ ] Review capacity utilization
- [ ] Analyze patient drop-off rates
- [ ] Check for security issues
- [ ] Update dependencies
- [ ] Clean up old cancelled bookings

---

## Post-Launch Enhancements

### Phase 1: Core Features (Week 1)

- [ ] WhatsApp API integration
  ```bash
  npm install twilio  # or whatsapp-api
  ```
  Update `/lib/booking-service.ts`:
  ```typescript
  async function sendWhatsAppNotification(phone, message) {
    const client = require('twilio')(accountSid, authToken);
    await client.messages.create({
      from: 'whatsapp:+1xxx',
      to: `whatsapp:${phone}`,
      body: message
    });
  }
  ```

- [ ] Admin authentication
  ```bash
  npm install next-auth
  ```

### Phase 2: Patient Experience (Week 2)

- [ ] Email confirmations
- [ ] SMS reminders 24h before
- [ ] Patient cancellation self-service
- [ ] Booking history for patients

### Phase 3: Operations (Week 3)

- [ ] Department management UI
- [ ] Staff assignment per booking
- [ ] Analytics dashboard
- [ ] Automated reports

---

## Troubleshooting Production Issues

### Issue: "Connection refused" from Vercel

**Cause:** Database unreachable from Vercel servers
**Solution:**
```bash
# Check security groups allow Vercel IPs
# Verify DATABASE_URL is correct
# Check firewall rules
# Test with bastion host
```

### Issue: Slow API responses

**Cause:** Missing indexes or too many queries
**Solution:**
```sql
-- Run these in MySQL:
SELECT * FROM bookings WHERE DATE(appointment_time) = '2024-05-09';  -- Check if indexed
EXPLAIN SELECT * FROM bookings WHERE dept_id = 1 AND status = 'Pending';
```

### Issue: Bookings not created

**Cause:** Capacity logic error or database constraint
**Solution:**
```bash
# Check Vercel logs
# Verify database has proper foreign key constraints
# Check appointment_time format
```

### Issue: Memory or timeout errors

**Cause:** Too many concurrent requests or slow queries
**Solution:**
```typescript
// In /lib/booking-service.ts
// Add query timeout
const connection = await pool.getConnection();
connection.config.timeout = 10000; // 10 seconds
```

---

## Scaling Strategy

### Current Capacity

Your setup handles:
- ~1,000 bookings/day
- ~100 concurrent users
- Single MySQL instance

### When to Scale

**If growing beyond 10,000 bookings/day:**

1. **Database Scaling:**
   - Switch to MySQL with read replicas
   - Or migrate to cloud-native (Supabase, Neon)

2. **API Scaling:**
   - Vercel automatically scales with usage
   - Add caching layer (Redis)
   - Implement request queuing

3. **Architecture Changes:**
   - Add background job queue (Bull.js)
   - Separate admin and patient APIs
   - Add CDN for static assets

---

## Disaster Recovery

### Backup Strategy

```bash
# Automated daily backups (set in RDS/managed service):
# Enable automated backups with 30-day retention
```

### Restore Procedure

```bash
# If database corrupted:
# 1. Create new database instance
# 2. Restore from automated backup
# 3. Update DATABASE_URL
# 4. Test thoroughly before resuming
```

### Monitoring

- [ ] Enable CloudWatch alerts (AWS)
- [ ] Set up uptime monitoring
- [ ] Configure error tracking (Sentry)
- [ ] Enable database query logging

---

## Launch Day Checklist

```bash
# 1-2 hours before launch:
- [ ] Final security audit
- [ ] Database backup
- [ ] Load test
- [ ] Test all flows with QA team

# At launch:
- [ ] Verify all systems operational
- [ ] Monitor error logs closely
- [ ] Have rollback plan ready
- [ ] Communications with staff

# First 24 hours:
- [ ] Monitor system closely
- [ ] Respond quickly to issues
- [ ] Collect user feedback
- [ ] Track performance metrics

# First week:
- [ ] Daily monitoring
- [ ] Fix urgent bugs
- [ ] Gather usage patterns
- [ ] Plan optimizations
```

---

## Rollback Plan

If critical issue discovered:

```bash
# 1. Identify issue
# 2. Revert to previous version
#    Vercel → Deployments → Select previous → "Redeploy"
# 3. Notify team
# 4. Investigate root cause
# 5. Deploy fix when ready
```

---

## Success Metrics

Track these after launch:

| Metric | Target | How to Measure |
|--------|--------|---|
| Uptime | 99.9% | Vercel analytics |
| API Response Time | <200ms | Vercel logs |
| Booking Completion Rate | >90% | Database queries |
| Patient Satisfaction | >4.5/5 | Manual surveys |
| System Errors | <0.1% | Error tracking |

---

## Support & Escalation

**In Case of Production Issues:**

1. Check Vercel status dashboard
2. Review application logs
3. Check database connection
4. Roll back to previous version if critical
5. Investigate root cause
6. Deploy fix
7. Monitor for 24 hours

---

**Ready to launch?** You've got this! 🚀
