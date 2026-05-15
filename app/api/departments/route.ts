import { NextRequest, NextResponse } from 'next/server';
import { getDepartments } from '@/lib/booking-service';

export async function GET(request: NextRequest) {
  try {
    const departments = await getDepartments();
    return NextResponse.json(departments);
  } catch (error: any) {
    // Log the error for debugging
    console.error('Error fetching departments:', error);
    
    // Only fallback to demo data in development mode
    if (process.env.NODE_ENV === 'development') {
      const demoDepartments = [
        { id: 1, name: 'Laboratory', allows_home_service: true, max_concurrency: 5 },
        { id: 2, name: 'Imaging', allows_home_service: false, max_concurrency: 2 },
        { id: 3, name: 'General Consultation', allows_home_service: false, max_concurrency: 3 },
      ];
      return NextResponse.json(demoDepartments);
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}
