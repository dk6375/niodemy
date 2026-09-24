/**
 * List all auth users
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

  const res = await client.query(`
    select id, email, email_confirmed_at, created_at, raw_user_meta_data
    from auth.users
    order by created_at desc
    limit 10
  `)

  console.log(`Found ${res.rowCount} users:`)
  for (const row of res.rows) {
    console.log(`  - ${row.email} | confirmed: ${row.email_confirmed_at ? 'yes' : 'no'} | created: ${row.created_at}`)
  }

  await client.end()
}

main().catch((e) => { console.error(e); process.exit(1) })
