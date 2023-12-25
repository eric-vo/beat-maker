const staticDir = 'static/beats';

const instruments = ['kick', 'snare', 'clap', 'hat'];

let timeoutLoop;
let beat = 0;

const url = new URL(window.location.href);
const hexRegex = /^[0-9a-fA-F]$/;

const maxNameLength = 128;

const startingPattern = '0'.repeat(16);
const patternLength = 16;

const minTempo = 50;
const maxTempo = 200;
const defaultTempo = 120;

const volumeLevel = 0.4;

let loginUrl;

document.addEventListener('DOMContentLoaded', () => {
    const beatName = document.querySelector('#beat-name');
    const tempo = document.querySelector('#tempo');
    const tempoLabel = document.querySelector('#tempo-label');
    const metronome = document.querySelector('#metronome');

    loginUrl = document.querySelector('#login-url');

    const nameParam = url.searchParams.get('n');
    if (!nameParam || nameParam.length > maxNameLength) {
        url.searchParams.delete('n');
    }

    const tempoParam = url.searchParams.get('t');
    if (isNaN(tempoParam) || tempo.value == defaultTempo || tempoParam < minTempo || tempoParam > maxTempo) {
        url.searchParams.delete('t');
        tempo.value = defaultTempo;
        tempoLabel.innerHTML = tempo.value;
    }

    const metronomeParam = url.searchParams.get('m');
    if (!metronomeParam || metronomeParam.toLowerCase() !== 'true') {
        url.searchParams.delete('m');
    }

    const pattern = url.searchParams.get('p');
    if (pattern) {
        let validPattern = true;

        for (const char of pattern) {
            if (!hexRegex.test(char)) {
                validPattern = false;
                break;
            }
        }

        if (pattern.length !== patternLength) {
            validPattern = false;
        }

        if (validPattern) {
            fillNotes(pattern);

            if (pattern === startingPattern) {
                url.searchParams.delete('p');
            }
        } else {
            url.searchParams.delete('p');
        }
    }

    history.replaceState({}, '', url);
    updateLoginUrl();

    for (const instrument of instruments) {
        addAudioTrigger(instrument);
    }
    new Audio(`${staticDir}/metronome.wav`);

    document.querySelectorAll('.note').forEach(note => {
        note.onclick = () => {
            updateNote(note);
            updatePattern(note);
            updateLoginUrl();
        }
    });

    beatName.oninput = () => {
        if (beatName.value) {
            url.searchParams.set('n', beatName.value);
        } else {
            url.searchParams.delete('n');
        }
        history.replaceState({}, '', url);
        updateLoginUrl();
    };

    tempo.oninput = () => {
        tempoLabel.innerHTML = tempo.value;

        if (tempo.value == defaultTempo) {
            url.searchParams.delete('t');
        } else {
            url.searchParams.set('t', tempo.value);
        }
        history.replaceState({}, '', url);
        updateLoginUrl();
    };

    metronome.onchange = () => {
        if (metronome.checked) {
            url.searchParams.set('m', metronome.checked);
        } else {
            url.searchParams.delete('m');
        }
        history.replaceState({}, '', url);
        updateLoginUrl();
    };

    document.querySelector('#play').onclick = () => {
        resetPlayingNotes();
        beat = 0;
        playBeat();
    };

    document.querySelector('#stop').onclick = () => {
        resetPlayingNotes();
    };

    document.querySelector('#reset').onclick = () => {
        beatName.value = '';

        tempo.value = defaultTempo;
        tempoLabel.innerHTML = tempo.value;

        metronome.checked = false;

        clearNotes();
        resetPlayingNotes();

        history.replaceState(null, null, window.location.pathname);
        updateLoginUrl();
    };
});

function addAudioTrigger(name) {
    new Audio(`${staticDir}/${name}.wav`);
    document.querySelector(`#${name}`).onclick = () => {
        playAudio(name);
    };
}

function playAudio(name) {
    const audio = new Audio(`${staticDir}/${name}.wav`);
    audio.volume = volumeLevel;
    audio.play();
}

function playBeat() {
    document.querySelectorAll('.note').forEach(note => {
        if (note.dataset.id == beat) {
            note.classList.add('playing-note');

            if (note.classList.contains('colored-note')) {
                playAudio(note.parentElement.parentElement.dataset.instrument);
            }
        } else if (note.dataset.id == (beat + patternLength - 1) % patternLength) {
            note.classList.remove('playing-note');
        }
    });

    if (beat % 2 == 0 && document.querySelector('#metronome').checked) {
        playAudio('metronome');
    }

    beat = (beat < patternLength - 1) ? beat + 1 : 0;
    timeoutLoop = setTimeout(playBeat, 60 / tempo.value / 2 * 1000);
}

function resetPlayingNotes() {
    if (timeoutLoop) {
        clearTimeout(timeoutLoop);
    }
    document.querySelectorAll('.note').forEach(note => {
        note.classList.remove('playing-note');
    });
}

function updateNote(note) {
    if (note.classList.contains('blank-note')) {
        note.classList.add('colored-note');
        note.classList.remove('blank-note');
    } else {
        note.classList.add('blank-note');
        note.classList.remove('colored-note');
    }
}

function fillNotes(pattern) {
    for (let i = 0, length = pattern.length; i < length; i++) {
        const binaryColumn = hexToBinary(pattern[i]);

        let rows = [];
        for (const instrument of instruments) {
            rows.push(document.querySelectorAll(`.${instrument}-row`));
        }

        for (let j = 0, length2 = binaryColumn.length; j < length2; j++) {
            if (binaryColumn[j] === '1') {
                rows[j][i].classList.remove('blank-note');
                rows[j][i].classList.add('colored-note');
            }
        }
    }
}

function updatePattern(note) {
    let pattern = url.searchParams.get('p');
    if (!pattern) {
        pattern = startingPattern;
    }

    // Convert targeted column to binary
    const hexColumn = pattern[note.dataset.id];
    const binaryColumn = hexToBinary(hexColumn);

    const instrumentIndex = instruments.indexOf(
        note.parentElement.parentElement.dataset.instrument
    );

    // Flip the bit corresponding to the note
    // And convert the column back to hex
    const newBit = (binaryColumn[instrumentIndex] === '0') ? '1' : '0';
    const newBinaryColumn = binaryColumn.substring(0, instrumentIndex)
        + newBit + binaryColumn.substring(instrumentIndex + 1);
    const newHexColumn = binaryToHex(newBinaryColumn);

    // Update the pattern
    let newPattern = pattern.substring(0, note.dataset.id)
        + newHexColumn + pattern.substring(parseInt(note.dataset.id) + 1);
    newPattern = newPattern.padEnd(patternLength, '0');

    if (newPattern === startingPattern) {
        url.searchParams.delete('p');
    } else {
        url.searchParams.set('p', newPattern);
    }
    history.replaceState({}, '', url);
}

function clearNotes() {
    document.querySelectorAll('.note').forEach(note => {
        note.classList.remove('colored-note');
    });
}

function hexToBinary(char) {
    return parseInt(char, 16).toString(2).padStart(4, '0'); // Make it 4 characters
}

// Takes 4 character binary string
function binaryToHex(string) {
    return parseInt(string, 2).toString(16);
}

function updateLoginUrl() {
    if (loginUrl) {
        loginUrl.href = `/login?next=${window.location.pathname}${encodeURIComponent(window.location.search)}`;
    }
}
