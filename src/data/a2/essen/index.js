// src/data/a2/essen/index.js
import { essenObstGemueseVocab } from './essen_obst_gemuese.js';
import { essenGetraenkeBestellungVocab } from './essen_getraenke_bestellung.js';
import { essenFruehstueckVocab } from './essen_fruehstueck.js';
import { essenMittagessenVocab } from './essen_mittagessen.js';
import { essenReservierungVocab } from './essen_reservierung.js';
import { essenMengenangabenVocab } from './essen_mengenangaben.js';

export const essenVocab = {
    "Obst & Gemüse": essenObstGemueseVocab,
    "Getränke & Bestellung": essenGetraenkeBestellungVocab,
    "Frühstück": essenFruehstueckVocab,
    "Mittagessen": essenMittagessenVocab,
    "Reservierung": essenReservierungVocab,
    "Mengenangaben": essenMengenangabenVocab
};
