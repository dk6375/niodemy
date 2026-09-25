/**
 * Check GK data
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

  console.log('--- Current Events ---')
  const events = await client.query('select slug, title, category from public.current_events')
  console.table(events.rows)

  console.log('\n--- Event-Exams ---')
  const ee = await client.query(`
    select e.slug as event_slug, e.title, ex.slug as exam_slug, ee.relevance
    from public.event_exams ee
    join public.current_events e on ee.event_id = e.id
    join public.exams ex on ee.exam_id = ex.id
    order by ex.slug, e.event_date
  `)
  console.table(ee.rows)

  await client.end()
}

main().catch((e) => { console.error(e); process.exit(1) })
