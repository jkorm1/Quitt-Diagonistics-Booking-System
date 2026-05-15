import { NextRequest, NextResponse } from 'next/server';
import { createBooking, getBookingsByDate,  getAllBookings } from '@/lib/booking-service';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      patientName,
      phoneNumber,
      deptId,
      appointmentTime,
      serviceType = 'In-Clinic',
      locationAddress,
      problemDescription,
    } = body;

    if (!patientName || !phoneNumber || !deptId || !appointmentTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    try {
      const booking = await createBooking(
        patientName,
        phoneNumber,
        deptId,
        appointmentTime,
        serviceType,
        locationAddress,
        problemDescription
      );
      return NextResponse.json(booking, { status: 201 });
    } catch (dbError: any) {
      // Return specific error message from database operation
      return NextResponse.json(
        { error: dbError.message || 'Failed to create booking' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');

    if (!date) {
      // If no date is provided, return all bookings
      const allBookings = await getAllBookings();
      return NextResponse.json(allBookings);
    }

    const bookings = await getBookingsByDate(date);
    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
