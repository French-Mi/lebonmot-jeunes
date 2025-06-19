// src/data/a3/verben/index.js
import { verbenErVocab } from './verben_er.js';
import { verbenUnregelmaessigVocab } from './verben_unregelmaessig.js';
import { verbenReflexivVocab } from './verben_reflexiv.js';

export const verbenVocab = {
    "Regelmäßige Verben auf '-er'": verbenErVocab,
    "Unregelmäßige Verben": verbenUnregelmaessigVocab,
    "Reflexive Verben": verbenReflexivVocab
};
