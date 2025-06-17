// src/data/index.js
// Diese Datei importiert alle Vokabel-Module und exportiert sie als ein einziges Objekt.

import { grundlagenVocab } from './grundlagen.js'
import { a1Vocab } from './a1.js'
import { a2Vocab } from './a2.js'
import { lektuerenData } from './lektueren.js'

export const allVocabData = {
  Grundlagen: grundlagenVocab,
  A1: a1Vocab,
  A2: a2Vocab,
  // KORREKTUR: Erstellt einen "Lektüren"-Schlüssel und weist ihm
  // das gesamte Objekt aus deiner lektueren.js zu.
  Lektüren: lektuerenData,
}
