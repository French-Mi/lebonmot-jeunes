// src/services/speechService.js

const synth = window.speechSynthesis;
let frenchVoices = [];

// Funktion zum Laden der Stimmen.
export function loadVoices() {
    if (!synth) {
        console.warn("Sprachsynthese wird nicht unterstützt.");
        return;
    }
    const setVoices = () => {
        frenchVoices = synth.getVoices().filter(v => v.lang.startsWith('fr'));
    };
    setVoices();
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = setVoices;
    }
}

// Funktion zum Sprechen von Text.
export function speakFrench(textToSpeak, event) {
    if (event) event.stopPropagation();
    if (!synth || !textToSpeak) return;

    if (synth.speaking) {
        synth.cancel();
    }

    const cleanedText = String(textToSpeak).replace(/\(.*\)/gi, '').replace(/\b(qc|qn)\b\.?/gi, '').trim();
    if (!cleanedText) return;

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    if (frenchVoices.length > 0) {
        const voice = frenchVoices.find(v => v.name.toLowerCase().includes('amelie')) || frenchVoices[0];
        if (voice) utterance.voice = voice;
    }

    utterance.onerror = (e) => console.error("Fehler bei der Sprachsynthese:", e.error);

    synth.speak(utterance);
}
