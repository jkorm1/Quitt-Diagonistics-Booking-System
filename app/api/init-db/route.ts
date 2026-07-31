import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';

export async function POST() {
  const log: string[] = [];

  try {
    const sqlPath = path.join(process.cwd(), 'init.sql');
    const rawSql = fs.readFileSync(sqlPath, 'utf8');

    // Strip full-line comments, then split into individual statements on ';'
    const statements = rawSql
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n')
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`[init-db] Found ${statements.length} statements to run`);

    const connection = await pool.getConnection();

    try {
      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        const preview = stmt.replace(/\s+/g, ' ').slice(0, 80);

        console.log(`[init-db] (${i + 1}/${statements.length}) Running: ${preview}`);
        log.push(`OK: ${preview}`);

        await connection.query(stmt);
      }
    } catch (stmtError: any) {
      // Remove the log entry for the statement that actually failed,
      // since we pushed it optimistically before running it
      log.pop();
      log.push(`FAILED: ${stmtError?.sqlMessage || stmtError?.message}`);

      console.error('[init-db] Statement failed:', {
        index: log.length,
        message: stmtError?.sqlMessage || stmtError?.message,
        code: stmtError?.code,
      });

      return NextResponse.json(
        {
          message: 'Database initialization failed',
          failedAtStatement: log.length,
          error: stmtError?.sqlMessage || stmtError?.message,
          executedSoFar: log,
        },
        { status: 500 }
      );
    } finally {
      connection.release();
    }

    return NextResponse.json(
      { message: 'Database initialized successfully', totalStatements: statements.length, executed: log },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[init-db] Setup error (file read / connection):', error);
    return NextResponse.json(
      { message: 'Failed to initialize database', error: error?.message },
      { status: 500 }
    );
  }
}