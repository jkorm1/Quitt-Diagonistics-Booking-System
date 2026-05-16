import pool from './db';
import { v4 as uuidv4 } from 'uuid';

export interface Department {
  id: number;
  name: string;
  max_concurrency: number;
  allows_home_service: boolean;
}

export interface Booking {
  id: string;
  patient_name: string;
  phone_number: string;
  dept_id: number;
  service_type: 'In-Clinic' | 'Home-Service';
  location_address?: string;
  problem_description?: string;
  appointment_time: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  created_at: string;
}

export interface SlotInfo {
  time: string;
  available: boolean;
}

export async function getDepartments(): Promise<Department[]> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM departments ORDER BY name');
    return rows as Department[];
  } finally {
    connection.release();
  }
}

export async function getAllBookings(): Promise<Booking[]> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT b.*, d.name as dept_name 
       FROM bookings b
       JOIN departments d ON b.dept_id = d.id
       ORDER BY b.appointment_time DESC`
    );
    return rows as Booking[];
  } finally {
    connection.release();
  }
}


export async function checkConcurrency(
  deptId: number,
  appointmentTime: string
): Promise<boolean> {
  const connection = await pool.getConnection();
  try {
    const [dept] = await connection.query(
      'SELECT max_concurrency FROM departments WHERE id = ?',
      [deptId]
    );

    if (!Array.isArray(dept) || dept.length === 0) {
      throw new Error('Department not found');
    }

    const maxConcurrency = (dept[0] as any).max_concurrency;

    const [bookings] = await connection.query(
      `SELECT COUNT(*) as count FROM bookings 
       WHERE dept_id = ? AND appointment_time = ? AND status = 'Pending'`,
      [deptId, appointmentTime]
    );

    const currentCount = (bookings[0] as any).count;
    return currentCount < maxConcurrency;
  } finally {
    connection.release();
  }
}

export async function createBooking(
  patientName: string,
  phoneNumber: string,
  deptId: number,
  appointmentTime: string,
  serviceType: 'In-Clinic' | 'Home-Service' = 'In-Clinic',
  locationAddress?: string,
  problemDescription?: string
): Promise<Booking> {
  const connection = await pool.getConnection();
  try {
    // Verify concurrency before booking
    const hasSlot = await checkConcurrency(deptId, appointmentTime);
    if (!hasSlot) {
      throw new Error('No available slots for this time');
    }

    const id = uuidv4();
    await connection.query(
      `INSERT INTO bookings 
       (id, patient_name, phone_number, dept_id, service_type, location_address, problem_description, appointment_time, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [id, patientName, phoneNumber, deptId, serviceType, locationAddress, problemDescription, appointmentTime]
    );

    // Send WhatsApp notification
    await sendWhatsAppNotification(
      phoneNumber,
      `Your booking is confirmed for ${appointmentTime}`
    );

    const [result] = await connection.query('SELECT * FROM bookings WHERE id = ?', [id]);
    return (result as Booking[])[0];
  } finally {
    connection.release();
  }
}

export async function getBookingsByDate(date: string): Promise<Booking[]> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT b.*, d.name as dept_name FROM bookings b
       JOIN departments d ON b.dept_id = d.id
       WHERE DATE(b.appointment_time) = ? AND b.status != 'Cancelled'
       ORDER BY b.appointment_time ASC`,
      [date]
    );
    return rows as Booking[];
  } finally {
    connection.release();
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: 'Completed' | 'Cancelled'
): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.query('UPDATE bookings SET status = ? WHERE id = ?', [status, bookingId]);
  } finally {
    connection.release();
  }
}

export async function getAvailableSlots(
  deptId: number,
  date: string
): Promise<SlotInfo[]> {
  const connection = await pool.getConnection();
  try {
    // 1. Fetch the max_concurrency for the selected department
    const [deptData] = await connection.query(
      'SELECT max_concurrency FROM departments WHERE id = ?',
      [deptId]
    );

    if (!Array.isArray(deptData) || deptData.length === 0) {
      throw new Error('Department not found');
    }

    const maxConcurrency = (deptData[0] as any).max_concurrency;

    // 2. Determine operating hours based on day of week
    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Quitt Diagnostics hours: Monday-Saturday 24 hours, Sunday 2:00 PM - Midnight
    let startHour = 0; // Default start hour
    let endHour = 24; // Default end hour
    
    if (dayOfWeek === 0) { // Sunday
      startHour = 14; // 2:00 PM
      endHour = 24; // Midnight
    }
    
    const slots: SlotInfo[] = [];

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Format time as "HH:MM" for database query
        const time24 = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        const appointmentTime = `${date} ${time24}`;

        // 3. Count existing bookings for this specific time slot
        const [bookingCounts] = await connection.query(
          `SELECT COUNT(*) as count FROM bookings 
           WHERE dept_id = ? AND appointment_time = ? AND status != 'Cancelled'`,
          [deptId, appointmentTime]
        );

        const currentCount = (bookingCounts[0] as any).count;

        // 4. Determine availability based on concurrency limit
        const isAvailable = currentCount < maxConcurrency;

        // 5. Format time as "HH:MM AM/PM" for frontend display
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        const displayMinute = String(minute).padStart(2, '0');
        const time12 = `${displayHour}:${displayMinute} ${period}`;

        slots.push({ time: time12, available: isAvailable });
      }
    }

    return slots;
  } catch (error) {
    console.error('Error in getAvailableSlots:', error);
    throw error;
  } finally {
    connection.release();
  }
}



async function sendWhatsAppNotification(phone: string, message: string): Promise<void> {
  // Placeholder for WhatsApp integration
  console.log(`[WhatsApp] ${phone}: ${message}`);
  // TODO: Integrate with WhatsApp API
}
