/**
 * Migration Runner — Executes SQL files against Supabase PostgreSQL.
 * Uses the `pg` package with the connection string from .env.local
 *
 * Usage: bun run scripts/migrate.ts [migration_file.sql]
 *        bun run scripts/migrate.ts seed [seed_file.sql]
 *        bun run scripts/migrate.ts all  (run all migrations in order)
 */
import { Client } from 'pg'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const DB_URL = process.env.SUPABASE_DB_URL!

if (!DB_URL) {
  console.error('❌ SUPABASE_DB_URL not set in .env.local')
  process.exit(1)
}

const MIGRATIONS_DIR = join(process.cwd(), 'supabase/migrations')
const SEED_DIR = join(process.cwd(), 'supabase/seed')

async function runSqlFile(client: Client, filePath: string, label: string) {
  const sql = readFileSync(filePath, 'utf-8')
  console.log(`▶ Running ${label}: ${filePath.split('/').pop()}`)
  try {
    await client.query(sql)
    console.log(`✓ ${label} complete`)
  } catch (err: any) {
    console.error(`✗ ${label} failed:`, err.message)
    throw err
  }
}

async function main() {
  const client = new Client({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false },
  })

  console.log('🔌 Connecting to Supabase...')
  await client.connect()
  console.log('✓ Connected\n')

  const arg = process.argv[2]

  try {
    if (arg === 'all') {
      // Run all migrations in order
      const files = readdirSync(MIGRATIONS_DIR)
        .filter((f) => f.endsWith('.sql'))
        .sort()
      console.log(`📂 Found ${files.length} migration files\n`)
      for (const f of files) {
        await runSqlFile(client, join(MIGRATIONS_DIR, f), `migration`)
        console.log('')
      }
      console.log('🎉 All migrations complete!')
    } else if (arg === 'seed') {
      const seedFile = process.argv[3]
      if (seedFile) {
        await runSqlFile(client, join(SEED_DIR, seedFile), 'seed')
      } else {
        // Run all seed files in order
        const files = readdirSync(SEED_DIR)
          .filter((f) => f.endsWith('.sql'))
          .sort()
        console.log(`📂 Found ${files.length} seed files\n`)
        for (const f of files) {
          await runSqlFile(client, join(SEED_DIR, f), `seed`)
          console.log('')
        }
      }
      console.log('🎉 All seeds complete!')
    } else if (arg) {
      // Single migration file
      await runSqlFile(client, join(MIGRATIONS_DIR, arg), 'migration')
    } else {
      console.log('Usage:')
      console.log('  bun run scripts/migrate.ts all              Run all migrations')
      console.log('  bun run scripts/migrate.ts seed             Run all seeds')
      console.log('  bun run scripts/migrate.ts seed <file.sql>  Run specific seed')
      console.log('  bun run scripts/migrate.ts <file.sql>       Run specific migration')
    }
  } finally {
    await client.end()
    console.log('\n🔌 Disconnected')
  }
}

main().catch((err) => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
