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
       { id: 1, name: 'Ultrasound Scans', allows_home_service: false, max_concurrency: 3, description: 'Imaging using sound waves to visualize internal organs.' },
      { id: 2, name: 'Fluoroscopy Studies', allows_home_service: false, max_concurrency: 2, description: 'Real-time X-ray imaging for diagnostic procedures.' },
      { id: 3, name: 'Mammogram', allows_home_service: false, max_concurrency: 2, description: 'Breast imaging for cancer screening and diagnosis.' },
      { id: 4, name: 'Laboratory Services', allows_home_service: true, max_concurrency: 5, description: 'Blood, urine, and other sample testing.' },
      { id: 5, name: 'X-rays of Any Part', allows_home_service: false, max_concurrency: 3, description: 'General radiographic imaging for bones and tissues.' },
      { id: 6, name: 'MRI & CT Scan', allows_home_service: false, max_concurrency: 2, description: 'Advanced imaging for internal structures and organs.' },
      { id: 7, name: 'General Consultation', allows_home_service: false, max_concurrency: 1, description: 'Initial medical evaluation and diagnosis.' }
      ];
      return NextResponse.json(demoDepartments);
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}
