/**
 * Multi-language support (Hindi + English)
 *
 * Concepts can have translations in concept_translations table.
 * This helper fetches the translated version if available.
 */

import { createClient } from '@/lib/supabase/server'

export type Language = 'hi' | 'en'

/**
 * Get concept translation for a specific language.
 * Falls back to original if translation not found.
 */
export async function getConceptTranslation(conceptId: string, language: Language) {
  if (language === 'en') return null // English is the default

  const supabase = await createClient()
  const { data } = await supabase
    .from('concept_translations')
    .select('title, summary, content_json')
    .eq('concept_id', conceptId)
    .eq('language', language)
    .single()

  return data
}

/**
 * Language labels for UI
 */
export const languageLabels: Record<Language, { name: string; nativeName: string; flag: string }> = {
  hi: { name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
}
