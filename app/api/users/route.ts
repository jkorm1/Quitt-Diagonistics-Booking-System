import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query('SELECT id, username, role, created_at FROM users');
      return NextResponse.json({ users });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, role } = body;

    if (!username || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate role
    if (role !== 'Admin' && role !== 'Staff') {
      return NextResponse.json(
        { error: 'Invalid role. Must be Admin or Staff' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    try {
      // Check if username already exists
      const [existingUsers] = await connection.query(
        'SELECT id FROM users WHERE username = ?',
        [username]
      );

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 409 }
        );
      }

      // Hash the password
      const password_hash = await bcrypt.hash(password, 10);

      // Create the user
      const [result] = await connection.query(
        'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
        [username, password_hash, role]
      );

      // Get the created user
      const [newUsers] = await connection.query(
        'SELECT id, username, role, created_at FROM users WHERE id = ?',
        [(result as any).insertId]
      );

      const newUser = Array.isArray(newUsers) ? newUsers[0] : null;

      return NextResponse.json({
        message: 'User created successfully',
        user: newUser
      }, { status: 201 });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    try {
      // Check if user exists
      const [users] = await connection.query(
        'SELECT id FROM users WHERE id = ?',
        [id]
      );

      if (!Array.isArray(users) || users.length === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Delete the user
      await connection.query('DELETE FROM users WHERE id = ?', [id]);

      return NextResponse.json({ message: 'User deleted successfully' });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
