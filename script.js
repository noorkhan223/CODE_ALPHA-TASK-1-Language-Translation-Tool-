async function translateText() {
  const text = document.getElementById("inputText").value.trim();
  const source = document.getElementById("sourceLang").value;
  const target = document.getElementById("targetLang").value;
  const outputDiv = document.getElementById("output");

  if (!text) {
    alert("Please enter text.");
    return;
  }

  if (source === target) {
    alert("Please select different languages for translation.");
    return;
  }

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // If translatedText is same as input text → no translation occurred
    if (data.responseData.translatedText.trim() === text.trim()) {
      alert("Please select the correct source language according to your input.");
      return;
    }

    if (data.responseData && data.responseData.translatedText) {
      outputDiv.innerHTML = `<b>Translated:</b> ${data.responseData.translatedText}`;
    } else {
      outputDiv.innerHTML = `<span class="error">Translation failed.</span>`;
    }
  } catch (error) {
    console.error(error);
    outputDiv.innerHTML = `<span class="error">Error occurred during translation.</span>`;
  }
}

function copyText() {
  const output = document.getElementById("output").innerText.replace('Translated: ', '').trim();
  if (output) {
    navigator.clipboard.writeText(output);
    alert("Copied!");
  }
}

function clearFields() {
  document.getElementById("inputText").value = "";
  document.getElementById("output").innerText = "";
}

function speakText() {
  const output = document.getElementById("output").innerText.replace('Translated: ', '').trim();
  const targetLang = document.getElementById("targetLang").value;

  if (!output) return;

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(output);

  const langMap = {
    en: 'en-US',
    fr: 'fr-FR',
    de: 'de-DE',
    es: 'es-ES',
    ur: 'ur-PK',
    ar: 'ar-SA',
    hi: 'hi-IN'
  };

  utterance.lang = langMap[targetLang] || 'en-US';

  const voices = synth.getVoices();
  const voice = voices.find(v => v.lang === utterance.lang);
  if (voice) utterance.voice = voice;

  synth.cancel();
  synth.speak(utterance);
}

// Preload voices
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices();
  };
}
