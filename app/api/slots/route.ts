import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/booking-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const deptId = searchParams.get('deptId');
    const date = searchParams.get('date');

    if (!deptId || !date) {
      return NextResponse.json(
        { error: 'deptId and date parameters required' },
        { status: 400 }
      );
    }

    const slots = await getAvailableSlots(parseInt(deptId), date);
    return NextResponse.json({ slots });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch slots' },
      { status: 500 }
    );
  }
}
