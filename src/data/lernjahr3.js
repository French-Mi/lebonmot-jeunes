// src/data/lernjahr3.js
// Importiert alle Kapitel für das 3. Lernjahr und setzt sie zusammen.

import { verbenVocab } from './a3/verben/index.js';
import { geographieVocab } from './a3/geographie.js';
import { haushaltVocab } from './a3/haushalt.js';
import { bildbeschreibungEinleitungVocab } from './a3/bildbeschreibung_einleitung.js';
import { bildbeschreibungHauptteilVocab } from './a3/bildbeschreibung_hauptteil.js';
import { adjektiveVocab } from './a3/adjektive.js';

export const lernjahr3Vocab = {
    "Verben": verbenVocab,
    "Geographie": geographieVocab,
    "Aufgaben im Haushalt": haushaltVocab,
    "Bildbeschreibung: Einleitung": bildbeschreibungEinleitungVocab,
    "Bildbeschreibung: Hauptteil": bildbeschreibungHauptteilVocab,
    "Adjektive": adjektiveVocab
};
