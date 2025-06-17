// src/utils/helpers.js

/**
 * Ermittelt die Kalenderwoche für ein gegebenes Datum.
 * @param {Date} d Das Datum.
 * @returns {string} Die Kalenderwoche im Format 'YYYY-WXX'.
 */
export function getWeekNumber(d) {
    try {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return d.getUTCFullYear() + '-W' + weekNo;
    } catch (e) {
        console.error("Error in getWeekNumber:", e);
        return new Date().getFullYear() + '-W01';
    }
}

// Weitere Hilfsfunktionen können bei Bedarf hier hinzugefügt werden.
