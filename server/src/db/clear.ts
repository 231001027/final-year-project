import { pool } from './pool.js';

async function clear() {
  await pool.query('DELETE FROM allocations');
  await pool.query('DELETE FROM teams');
  await pool.query('DELETE FROM projects');
  await pool.query('DELETE FROM faculty');
  console.log('All database records cleared successfully.');
  await pool.end();
}

clear().catch((err) => {
  console.error('Database clear failed:', err);
  process.exit(1);
});
