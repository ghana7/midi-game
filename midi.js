// DOM init
midiEventsDiv = document.querySelector("#midiEvents");

//Initialize midi stuff

var midi = null;  // global MIDIAccess object
function onMIDISuccess(midiAccess) {
    console.log("MIDI ready!");
    midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)
    
    midiEventsDiv = document.querySelector("#midiEvents");
    startLoggingMIDIInput(0);
}

function onMIDIFailure(msg) {
    console.log("Failed to get MIDI access - " + msg);
}

let startMIDI = () => {
    window.navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
}

startMIDI();


function startLoggingMIDIInput(indexOfPort) {
    midi.inputs.forEach(function (entry) { entry.onmidimessage = onMIDIMessage; });
}


//debug for if the device isn't working
function listInputsAndOutputs() {
    for (var entry of midi.inputs) {
        var input = entry[1];
        console.log("Input port [type:'" + input.type + "'] id:'" + input.id +
            "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
            "' version:'" + input.version + "'");
    }

    for (var entry of midi.outputs) {
        var output = entry[1];
        console.log("Output port [type:'" + output.type + "'] id:'" + output.id +
            "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
            "' version:'" + output.version + "'");
    }
}

//first midi message event - gets raw data
function onMIDIMessage(event) {
    //note off
    if(event.data[0].toString(16)[0] == "8") {

    } 
    // note on
    if(event.data[0].toString(16)[0] == "9") {
        //can get rid of midi
        midiNoteOnEvent(event.data[1], event.data[2]);
    } 
}


//heres the thing to call
//pitch any integer, middle C (C4) is 60, every 12 up or down is an octave
// midiToNote puts it in form 'C3', 'Ab4', etc.
//velocity (volume) goes from 0 to 127 by default
let midiNoteOnEvent = (pitch, velocity) => {
    let str = "";
    str += "pitch: " + pitch + "(" + midiToNote(pitch) + ")";
    str += " velocity: " + velocity;
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(str));
    midiEventsDiv.innerHTML = "";
    midiEventsDiv.appendChild(p);
}