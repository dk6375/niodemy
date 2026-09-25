/**
 * Check current education data
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

  console.log('--- Boards ---')
  const boards = await client.query('select name, slug from public.boards')
  console.table(boards.rows)

  console.log('\n--- Classes ---')
  const classes = await client.query('select c.name, c.level, c.segment, b.name as board from public.classes c join public.boards b on c.board_id = b.id order by c.level')
  console.table(classes.rows)

  console.log('\n--- Curriculums ---')
  const curriculums = await client.query(`
    select cu.subject, cu.academic_year, c.name as class_name, c.level,
      count(cc.concept_id) as concept_count
    from public.curriculums cu
    join public.classes c on cu.class_id = c.id
    left join public.curriculum_concepts cc on cu.id = cc.curriculum_id
    group by cu.subject, cu.academic_year, c.name, c.level
    order by c.level, cu.subject
  `)
  console.table(curriculums.rows)

  await client.end()
}

main().catch((e) => { console.error(e); process.exit(1) })
