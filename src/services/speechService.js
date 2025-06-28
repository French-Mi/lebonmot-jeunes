// Ein reaktives Objekt, um den Status und die Stimmen zu speichern.
// So weiß die App immer, ob die Sprachausgabe bereit ist.
import { reactive } from 'vue'

const state = reactive({
  isSpeechReady: false,
  voices: []
})

// Diese Funktion initialisiert die Sprachsynthese sicher.
const initializeSpeechService = () => {
  // Nur ausführen, wenn wir im Browser sind und die API existiert.
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const loadVoices = () => {
      const voiceList = window.speechSynthesis.getVoices()
      if (voiceList.length > 0) {
        state.voices = voiceList
        state.isSpeechReady = true
        console.log('Stimmen erfolgreich geladen und Speech Service ist bereit.', state.voices)
        // Listener entfernen, da die Arbeit getan ist.
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
      }
    }

    // Warten, bis der Browser die Stimmen geladen hat.
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)

    // Aufruf, falls die Stimmen bereits beim Start verfügbar waren.
    loadVoices()
  } else {
    console.error('Web Speech API wird von diesem Browser nicht unterstützt.')
  }
}

// Führe die Initialisierung sofort aus, wenn diese Datei geladen wird.
initializeSpeechService()

// Die Hauptfunktion, die von Ihren Vue-Komponenten aufgerufen wird.
const speak = (text) => {
  if (!state.isSpeechReady || !text) {
    console.warn('Sprachausgabe nicht bereit oder kein Text zum Sprechen vorhanden.')
    return
  }

  const utterance = new SpeechSynthesisUtterance(text)

  // --- HIER IST DIE STIMMENAUSWAHL ---
  // Sie können die Priorität oder die Namen hier anpassen.

  // 1. Suche nach einer bevorzugten, hochqualitativen Stimme (z.B. von Google oder Microsoft).
  let selectedVoice = state.voices.find(
    (voice) => voice.name === 'Google français' || voice.name === 'Microsoft Paul - French (France)'
  )

  // 2. Falls nicht gefunden, suche irgendeine männliche Stimme für klassisches Französisch (fr-FR).
  if (!selectedVoice) {
    selectedVoice = state.voices.find(
      (voice) => voice.lang === 'fr-FR' && voice.gender === 'male'
    )
  }

  // 3. Als letzte Option, nimm irgendeine Stimme für klassisches Französisch (fr-FR).
  if (!selectedVoice) {
    selectedVoice = state.voices.find((voice) => voice.lang === 'fr-FR')
  }

  // Wenn eine passende Stimme gefunden wurde, weise sie zu.
  if (selectedVoice) {
    utterance.voice = selectedVoice
    console.log(`Stimme ausgewählt: ${selectedVoice.name}`)
  } else {
    // Ansonsten setze nur die Sprache als Fallback, der Browser wählt dann die Standardstimme.
    utterance.lang = 'fr-FR'
    console.log('Keine spezifische fr-FR Stimme gefunden, Browser-Standard wird verwendet.')
  }

  // Weitere Einstellungen (optional)
  utterance.pitch = 1 // Tonhöhe (0-2)
  utterance.rate = 1 // Geschwindigkeit (0.1-10)

  // Bricht eine eventuell laufende Ausgabe ab und startet die neue.
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

// Exportiere nur die `speak` Funktion für die Verwendung in der App.
export const speechService = {
  speak
}
