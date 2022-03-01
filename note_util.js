const SHARPS = "C C# D D# E F F# G G# A A# B".split(" ");
const FLATS = "C Db D Eb E F Gb G Ab A Bb B".split(" ");
midiToNote = (midi, options = {}) => {
    if (isNaN(midi) || midi === -Infinity || midi === Infinity) return "";
    midi = Math.round(midi);
    const pcs = options.sharps === true ? SHARPS : FLATS;
    const pc = pcs[midi % 12];
    if (options.pitchClass) {
        return pc;
    }
    const o = Math.floor(midi / 12) - 1;
    return pc + o;
}