/**
 * Module name mappings between French and English
 * These mappings ensure consistent module name translations across the application
 */

// Map from French module names to English module names (without item counts)
export const MODULE_NAME_MAP_FR_TO_EN: Record<string, string> = {
  'Raisonnement Probabiliste': 'Probabilistic Reasoning',
  'Raisonnement Scientifique': 'Scientific Reasoning',
  'Réflexion vs Intuition': 'Reflection vs Intuition',
  'Biais de Croyance': 'Belief Bias',
  'Raisonnement Disjonctif': 'Disjunctive Reasoning',
  'Ancrage': 'Anchoring',
  'Calibration des Connaissances': 'Knowledge Calibration',
  'Numératie Probabiliste': 'Probabilistic Numeracy',
  'Pensée Superstitieuse': 'Superstitious Thinking',
  'Attitudes Anti-Science': 'Anti-Science Attitudes',
  'Croyances Conspirationnistes': 'Conspiracy Beliefs',
  'Croyances Dysfonctionnelles': 'Dysfunctional Beliefs',
};

// Map from English module names to French module names (without item counts)
export const MODULE_NAME_MAP_EN_TO_FR: Record<string, string> = {
  'Probabilistic Reasoning': 'Raisonnement Probabiliste',
  'Scientific Reasoning': 'Raisonnement Scientifique',
  'Reflection vs Intuition': 'Réflexion vs Intuition',
  'Belief Bias': 'Biais de Croyance',
  'Disjunctive Reasoning': 'Raisonnement Disjonctif',
  'Anchoring': 'Ancrage',
  'Knowledge Calibration': 'Calibration des Connaissances',
  'Probabilistic Numeracy': 'Numératie Probabiliste',
  'Superstitious Thinking': 'Pensée Superstitieuse',
  'Anti-Science Attitudes': 'Attitudes Anti-Science',
  'Conspiracy Beliefs': 'Croyances Conspirationnistes',
  'Dysfunctional Beliefs': 'Croyances Dysfonctionnelles',
};

/**
 * Get the normalized module name (without item count)
 * @param moduleName - The module name possibly with item count like "Module Name (10 items)"
 * @returns The module name without the item count
 */
export function getNormalizedModuleName(moduleName: string): string {
  return moduleName.split(' (')[0].trim();
}

/**
 * Translate a module name to the target locale
 * @param moduleName - The module name to translate (can include item count)
 * @param targetLocale - The target locale ('en' or 'fr')
 * @param sourceLocale - The source locale (optional, will auto-detect if not provided)
 * @returns The translated module name (with item count if present in original)
 */
export function translateModuleName(
  moduleName: string,
  targetLocale: 'en' | 'fr',
  sourceLocale?: 'en' | 'fr'
): string {
  // Extract the base name and item count (if present)
  const match = moduleName.match(/^(.+?)(\s*\(\d+\s+items?\))?$/);
  if (!match) return moduleName;

  const baseName = match[1].trim();
  const itemCount = match[2] || '';

  // If we don't know the source locale, try to detect it
  if (!sourceLocale) {
    if (MODULE_NAME_MAP_FR_TO_EN[baseName]) {
      sourceLocale = 'fr';
    } else if (MODULE_NAME_MAP_EN_TO_FR[baseName]) {
      sourceLocale = 'en';
    } else {
      // Can't detect, return original
      return moduleName;
    }
  }

  // If source and target are the same, return original
  if (sourceLocale === targetLocale) {
    return moduleName;
  }

  // Translate the base name
  let translatedBaseName: string;
  if (sourceLocale === 'fr' && targetLocale === 'en') {
    translatedBaseName = MODULE_NAME_MAP_FR_TO_EN[baseName] || baseName;
  } else if (sourceLocale === 'en' && targetLocale === 'fr') {
    translatedBaseName = MODULE_NAME_MAP_EN_TO_FR[baseName] || baseName;
  } else {
    translatedBaseName = baseName;
  }

  // Combine with item count
  return translatedBaseName + itemCount;
}

/**
 * Get the translation key for a module name
 * This is used to get the translation key for moduleDescriptions
 * @param moduleName - The module name (can include item count)
 * @param locale - The current locale
 * @returns The normalized English module name (used as translation key)
 */
export function getModuleTranslationKey(moduleName: string, locale: 'en' | 'fr'): string {
  const normalized = getNormalizedModuleName(moduleName);

  // If it's already in English, return it
  if (MODULE_NAME_MAP_EN_TO_FR[normalized]) {
    return normalized;
  }

  // If it's in French, translate to English
  if (MODULE_NAME_MAP_FR_TO_EN[normalized]) {
    return MODULE_NAME_MAP_FR_TO_EN[normalized];
  }

  // Otherwise return as is
  return normalized;
}
