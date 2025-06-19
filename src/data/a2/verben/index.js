// src/data/a2/verben/index.js
import { verbenEr1Vocab } from './verben_er_1.js';
import { verbenEr2Vocab } from './verben_er_2.js';
import { verbenEr3Vocab } from './verben_er_3.js';
import { verbenUnregelmaessig1Vocab } from './verben_unregelmaessig_1.js';
import { verbenUnregelmaessig2Vocab } from './verben_unregelmaessig_2.js';
import { verbenUnregelmaessig3Vocab } from './verben_unregelmaessig_3.js';
import { verbenReflexivVocab } from './verben_reflexiv.js';

export const verbenVocab = {
    "Regelmäßig auf '-er' (1)": verbenEr1Vocab,
    "Regelmäßig auf '-er' (2)": verbenEr2Vocab,
    "Regelmäßig auf '-er' (3)": verbenEr3Vocab,
    "Unregelmäßig (1)": verbenUnregelmaessig1Vocab,
    "Unregelmäßig (2)": verbenUnregelmaessig2Vocab,
    "Unregelmäßig (3)": verbenUnregelmaessig3Vocab,
    "Reflexive Verben": verbenReflexivVocab
};
