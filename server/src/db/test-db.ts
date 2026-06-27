import { pool } from './pool.js';

async function testConn() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('CONNECTION_SUCCESS:', res.rows[0]);
  } catch (err: any) {
    console.error('CONNECTION_FAILED:', err.message);
  } finally {
    await pool.end();
  }
}

testConn();
