/**
 * Create a test user directly in Supabase auth
 * (bypasses email confirmation rate limits)
 */
import { Client } from 'pg'
import crypto from 'crypto'

const DB_URL = process.env.SUPABASE_DB_URL!

async function main() {
  const email = process.argv[2] || 'demo@niodemy.test'
  const password = process.argv[3] || 'demo1234'
  const fullName = process.argv[4] || 'Demo User'

  const client = new Client({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  })
  await client.connect()

  // Check if user exists
  const existing = await client.query('select id from auth.users where email = $1', [email])
  if (existing.rowCount && existing.rowCount > 0) {
    console.log(`User ${email} already exists. Confirming...`)
    await client.query('update auth.users set email_confirmed_at = now() where email = $1', [email])
    console.log('✓ Confirmed')
    await client.end()
    return
  }

  // Hash password using bcrypt-like approach (Supabase uses bcrypt)
  // We need to use the same password hashing. Supabase uses bcrypt with cost 10.
  // Since we can't easily do bcrypt in Node without the package, let's use Supabase's function.
  // Actually, auth.users has encrypted_password column. We can use crypt() pgcrypto function.
  
  const userId = crypto.randomUUID()
  
  // Insert user with pgcrypto's crypt function (Supabase uses bcrypt, but crypt with bf works)
  const res = await client.query(`
    insert into auth.users (
      instance_id, id, aud, role, email,
      encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token,
      recovery_token, email_change_token_new, email_change
    )
    values (
      '00000000-0000-0000-0000-000000000000',
      $1, 'authenticated', 'authenticated', $2,
      crypt($3, gen_salt('bf', 10)), now(),
      '{"provider":"email","providers":["email"]}',
      $4,
      now(), now(), '', '', '', ''
    )
    on conflict (id) do nothing
    returning id, email
  `, [userId, email, password, JSON.stringify({ full_name: fullName, display_name: fullName })])

  if (res.rowCount && res.rowCount > 0) {
    console.log(`✓ Created user: ${email}`)
    console.log(`  ID: ${userId}`)
    console.log(`  Password: ${password}`)
    console.log(`  Name: ${fullName}`)
  } else {
    console.log(`User ${email} could not be created`)
  }

  await client.end()
}

main().catch((e) => { console.error(e); process.exit(1) })
