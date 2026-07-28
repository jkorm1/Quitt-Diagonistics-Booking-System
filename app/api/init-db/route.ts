import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';

export async function POST() {
  try {
    const sqlPath = path.join(process.cwd(), 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    const connection = await pool.getConnection();
    await connection.query(sql);
    connection.release();
    
    return NextResponse.json({ message: 'Database initialized successfully' }, { status: 200 });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json({ message: 'Failed to initialize database' }, { status: 500 });
  }
}
