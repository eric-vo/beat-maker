const staticDir = 'static/beats';

const instruments = ['kick', 'snare', 'clap', 'hat'];

let timeoutLoop;
let beat = 0;

const url = new URL(window.location.href);
const hexRegex = /^[0-9a-fA-F]$/;

const startingPattern = '0000000000000000';

document.addEventListener('DOMContentLoaded', () => {
    const tempo = document.querySelector('#tempo');
    const tempoLabel = document.querySelector('#tempo-label')

    const metronome = document.querySelector('#metronome');

    const invalidPattern = document.querySelector('#invalid-pattern');

    const pattern = url.searchParams.get('p');
    if (pattern) {
        let validPattern = true;

        for (const char of pattern) {
            if (!hexRegex.test(char)) {
                validPattern = false;
                break;
            }
        }

        if (pattern.length !== 16) {
            validPattern = false;
        }

        if (validPattern) {
            fillNotes(pattern);
        } else {
            url.searchParams.delete('p');
            history.replaceState({}, '', url);

            invalidPattern.classList.remove('d-none');
            setTimeout(() => {
                invalidPattern.classList.add('d-none');
            }, 3000);
        }
    }

    document.querySelectorAll('.note').forEach(note => {
        note.onclick = () => {
            updateNote(note);
            updatePattern(note);
        }
    });

    tempo.onchange = () => {
        tempoLabel.innerHTML = tempo.value;

        url.searchParams.set('t', tempo.value);
        history.replaceState({}, '', url);
    };

    metronome.onchange = () => {
        url.searchParams.set('m', metronome.checked);
        history.replaceState({}, '', url);
    };

    for (const instrument of instruments) {
        addAudioTrigger(instrument);
    }
    new Audio(`${staticDir}/metronome.wav`);

    document.querySelector('#play').onclick = () => {
        resetPlayingNotes();
        beat = 0;
        playBeat();
    };

    document.querySelector('#stop').onclick = () => {
        resetPlayingNotes();
    };

    document.querySelector('#reset').onclick = () => {
        tempo.value = 120;
        tempoLabel.innerHTML = tempo.value;

        metronome.checked = false;

        clearNotes();
        resetPlayingNotes();

        history.replaceState(null, null, window.location.pathname);
    };
});

function addAudioTrigger(id) {
    new Audio(`${staticDir}/${id}.wav`);
    document.querySelector(`#${id}`).onclick = () => {
        playAudio(id);
    };
}

function playAudio(name) {
    const audio = new Audio(`${staticDir}/${name}.wav`);
    audio.play();
}

function playBeat() {
    document.querySelectorAll('.note').forEach(note => {
        if (note.dataset.id == beat) {
            note.classList.add('playing-note');

            if (note.classList.contains('colored-note')) {
                playAudio(note.parentElement.dataset.instrument);
            }
        } else if (note.dataset.id == (beat + 15) % 16) {
            note.classList.remove('playing-note');
        }
    });

    if (beat % 2 == 0 && document.querySelector('#metronome').checked) {
        playAudio('metronome');
    }

    beat = (beat < 15) ? beat + 1 : 0;
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
        note.parentElement.dataset.instrument
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
    newPattern = newPattern.padEnd(16, '0');
    url.searchParams.set('p', newPattern);
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
