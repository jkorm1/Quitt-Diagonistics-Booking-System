import { NextRequest, NextResponse } from 'next/server';
import { createBooking, getBookingsByDate, getAllBookings, updateBookingStatus } from '@/lib/booking-service';
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
      serviceCategory,
      locationAddress,
      problemDescription,
      prescriptionImage,
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
        serviceCategory,
        locationAddress,
        problemDescription, 
        prescriptionImage
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
    const status = searchParams.get('status');
    const departmentId = searchParams.get('departmentId');

    if (!date && !status && !departmentId) {
      // If no filters are provided, return all bookings
      const allBookings = await getAllBookings();
      return NextResponse.json(allBookings);
    }

    const bookings = await getBookingsByDate(date || new Date().toISOString().split('T')[0]);
    
    // Apply additional filters if provided
    let filteredBookings = bookings;
    if (status) {
      filteredBookings = filteredBookings.filter((b: any) => b.status === status);
    }
    if (departmentId) {
      filteredBookings = filteredBookings.filter((b: any) => b.dept_id === parseInt(departmentId));
    }
    
    return NextResponse.json(filteredBookings);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}


export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await updateBookingStatus(id, status);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update booking status' },
      { status: 500 }
    );
  }
}
