import { createClient } from '@/lib/supabase/server'

/** Get all ITI trades */
export async function getItiTrades() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('iti_trades')
    .select('id, slug, name, code, duration_years, description, career_opportunities')
    .eq('status', 'active')
    .order('name')
  return data || []
}

/** Get ITI trade by slug */
export async function getItiTradeBySlug(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('iti_trades')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()
  return data
}

/** Get modules for a trade */
export async function getItiModules(tradeId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('iti_modules')
    .select('id, semester_number, module_number, title, slug, description, module_type, duration_hours')
    .eq('trade_id', tradeId)
    .order('semester_number')
    .order('module_number')
  return data || []
}
