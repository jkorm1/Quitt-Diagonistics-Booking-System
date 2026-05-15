import { NextRequest, NextResponse } from 'next/server';
import { getBookingsByDate, updateBookingStatus } from '@/lib/booking-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    
    // If no date is provided, use today's date
    const today = date || new Date().toISOString().split('T')[0];
    const bookings = await getBookingsByDate(today);
    
    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error('Error fetching queue:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch queue' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await updateBookingStatus(bookingId, status as 'Completed' | 'Cancelled');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update booking' },
      { status: 500 }
    );
  }
}
