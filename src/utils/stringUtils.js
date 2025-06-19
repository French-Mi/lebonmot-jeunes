/**
 * Normalisiert einen String für Vokabelvergleiche.
 * - Wandelt in Kleinbuchstaben um.
 * - Entfernt Inhalte in Klammern, z.B. (m.).
 * - Vereinheitlicht verschiedene Apostroph-Arten.
 * - Entfernt alle Trenn- und Satzzeichen.
 * - Bereinigt überflüssige Leerzeichen.
 * @param {string} str Der zu normalisierende String.
 * @returns {string} Der normalisierte String.
 */
export function normalizeString(str) {
  if (typeof str !== 'string' || !str) {
    return '';
  }

  return str
    .toLowerCase() // 1. Alles in Kleinbuchstaben
    .replace(/\(.*?\)/g, '') // 2. Inhalte in Klammern entfernen
    .replace(/’|`|´/g, "'") // 3. Alle Apostroph-Arten zu einem Standard-Apostroph machen
    .replace(/[/,.;-]/g, ' ') // 4. Wichtige Trennzeichen durch Leerzeichen ersetzen
    .trim() // 5. Leerzeichen am Anfang/Ende entfernen
    .replace(/\s+/g, ' '); // 6. Mehrfache Leerzeichen zu einem einzigen reduzieren
}
