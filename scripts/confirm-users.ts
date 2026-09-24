/**
 * Auto-confirm test users in Supabase Auth
 * (Supabase has email confirmation ON by default)
 */
import { Client } from 'pg'

const DB_URL = process.env.SUPABASE_DB_URL!

async function main() {
  const client = new Client({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  })
  await client.connect()

  // Confirm all unconfirmed users
  const res = await client.query(`
    update auth.users
    set email_confirmed_at = now()
    where email_confirmed_at is null
    returning id, email
  `)

  console.log(`✓ Confirmed ${res.rowCount} users:`)
  for (const row of res.rows) {
    console.log(`  - ${row.email} (${row.id})`)
  }

  await client.end()
}

main().catch((e) => { console.error(e); process.exit(1) })
