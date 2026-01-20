// ================================================================
// FILE: src/lib/database/neon-connection.ts
// PURPOSE: PostgreSQL database connection using Neon
// ================================================================
import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export default sql;