/**
 * Quick verify: check data in Supabase (public schema)
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

  const tables = [
    ['concepts', 'select count(*) from public.concepts'],
    ['concept_prerequisites', 'select count(*) from public.concept_prerequisites'],
    ['content_assets', 'select count(*) from public.content_assets'],
    ['questions', 'select count(*) from public.questions'],
    ['collections', 'select count(*) from public.collections'],
  ]

  for (const [name, q] of tables) {
    const res = await client.query(q)
    console.log(`${name}: ${res.rows[0].count} rows`)
  }

  console.log('\n--- Sample concepts ---')
  const concepts = await client.query(
    'select slug, title, subject, status from public.concepts order by title limit 5'
  )
  for (const c of concepts.rows) {
    console.log(`  ${c.title} [${c.subject}] (${c.status}) → /concept/${c.slug}`)
  }

  console.log('\n--- Sample questions ---')
  const questions = await client.query(
    'select body, subject, difficulty, type from public.questions order by subject limit 3'
  )
  for (const q of questions.rows) {
    console.log(`  [${q.subject} D${q.difficulty} ${q.type}] ${q.body.substring(0, 60)}...`)
  }

  await client.end()
}

main().catch((e) => { console.error(e); process.exit(1) })
