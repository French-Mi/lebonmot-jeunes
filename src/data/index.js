// src/data/index.js
// Diese Datei importiert alle Vokabel-Module und exportiert sie als ein einziges Objekt.

import { lernjahr1Vocab } from './lernjahr1.js';
import { lernjahr2Vocab } from './lernjahr2.js';
import { lernjahr3Vocab } from './lernjahr3.js';
import { lernjahr4Vocab } from './lernjahr4.js';
import { lernjahr5Vocab } from './lernjahr5.js';
import { lektuerenData } from './lektueren.js';

export const allVocabData = {
  "1. Lernjahr": lernjahr1Vocab,
  "2. Lernjahr": lernjahr2Vocab,
  "3. Lernjahr": lernjahr3Vocab,
  "4. Lernjahr": lernjahr4Vocab,
  "5. Lernjahr": lernjahr5Vocab,
  "Lektüren": lektuerenData,
};
