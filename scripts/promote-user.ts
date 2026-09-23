/**
 * Promote a user to admin role (for testing console)
 */
import { Client } from 'pg'

const DB_URL = process.env.SUPABASE_DB_URL!
const email = process.argv[2] || 'demo@niodemy.test'
const role = process.argv[3] || 'admin'

async function main() {
  const client = new Client({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  })
  await client.connect()

  // Upsert profile
  const res = await client.query(`
    insert into public.profiles (id, email, role, full_name)
    select u.id, u.email, $2, coalesce(u.raw_user_meta_data->>'full_name', 'User')
    from auth.users u
    where u.email = $1
    on conflict (id) do update set role = $2
    returning id, email, role
  `, [email, role])

  if (res.rowCount && res.rowCount > 0) {
    console.log(`✓ User ${email} promoted to ${role}`)
    console.log(`  ID: ${res.rows[0].id}`)
  } else {
    console.log(`User ${email} not found. Create them first.`)
  }

  await client.end()
}

main().catch((e) => { console.error(e); process.exit(1) })
