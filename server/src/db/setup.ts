import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './pool.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setup() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  await pool.query(schema);
  console.log('Database schema applied successfully.');
  await pool.end();
}

setup().catch((err) => {
  console.error('Database setup failed:', err);
  process.exit(1);
});
