let noteCount = 12;
let hp = 12;

let ctx;
let width = 800, height = 800;
setup = () => {
    let canvas = document.querySelector("canvas");
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");

    let gameLoop = setInterval(loop, 1000 / 60);

    for (let i = 0; i < noteCount; i++) {
        enemies[i] = [];
    }
}

let time = 0;
let dt = 1 / 60;
let centerShapeR = 50;

let totalSpawnTimer = 2;
let spawnTimer = 0;

let noteAttacks = [];
let noteFadeSpeed = 1;

let enemies = [];
let enemySpeed = 50;

loop = () => {
    time += dt;
    ctx.clearRect(0, 0, width, height);

    noteAttacks.forEach(note => {
        let color = note.strength;
        drawNotePoly(width / 2, height / 2, centerShapeR, 1000, note.octave, `rgba(0,0,255,${color})`, `rgba(0,0,0,${color})`);

        if (!note.hasAttacked) {
            let section = enemies[note.octave];
            section.sort((a, b) => a.distance - b.distance);

            console.dir(section);

            if (section.length > 0)
                section[0].hp -= note.strength;

            note.hasAttacked = true;
        }

        note.strength -= dt * noteFadeSpeed;
    });

    noteAttacks.forEach((note, i) => {
        if (note.strength <= 0) noteAttacks.splice(i, 1);
    })

    enemies.forEach(section => section.forEach((enemy, i) => {
        if (enemy.hp <= 0) {
            section.splice(i, 1);

            // If you wanted to play a note for killing (here)

            return;
        }

        if (enemy.distance <= 25) {
            hp--;
            section.splice(i, 1);
            
            
            // If you wanted to play a note for taking damage (here)
            
            return;
        }

        let x = (width / 2) + Math.cos(enemy.angle) * enemy.distance;
        let y = (height / 2) + Math.sin(enemy.angle) * enemy.distance;
        drawCircle(x, y, 15, "red", "black");

        ctx.font = "15px Arial";
        ctx.fillStyle = "black"
        ctx.fillText(`${enemy.hp}`, x, y);

        enemy.distance -= dt * enemySpeed;
    }));

    centerShapeR = Math.cos(time * 2) + 50;
    drawCenterShape(width / 2, height / 2, centerShapeR, noteCount, "white", "black");

    let healthR = Math.sin(time * 2) + 30;
    for (let i = 0; i < noteCount; i++) {
        drawNotePoly(width / 2, height / 2, healthR, healthR + 10, i, "darkgray", "black", true);
    }
    for (let i = 0; i < hp; i++) {
        drawNotePoly(width / 2, height / 2, healthR, healthR + 10, i, "red", "black", true);
    }

    spawnTimer -= dt;

    if (spawnTimer <= 0) {
        spawnEnemy(Math.floor(Math.random() * noteCount));
        spawnTimer = totalSpawnTimer;
        totalSpawnTimer -= 0.01;
    }
}

drawCircle = (x, y, r, fillColor, strokeColor) => {
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

drawCenterShape = (x, y, r, e, fillColor, strokeColor) => {
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;

    ctx.beginPath();
    for (let i = 0; i <= e; i++) {
        let angle = (i / e) * 2 * Math.PI;
        let xPos = x + Math.cos(angle) * r;
        let yPos = y + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(xPos, yPos);
        ctx.lineTo(xPos, yPos);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

drawNotePoly = (x, y, r, maxR, n, fillColor, strokeColor, rounded = false) => {
    let a0 = (n / noteCount) * 2 * Math.PI - Math.PI / 2;
    let a1 = ((n + 1) / noteCount) * 2 * Math.PI - Math.PI / 2;
    let x0 = x + Math.cos(a0) * r;
    let y0 = y + Math.sin(a0) * r;
    let x1 = x + Math.cos(a1) * r;
    let y1 = y + Math.sin(a1) * r;
    let x2 = x + Math.cos(a0) * maxR;
    let y2 = y + Math.sin(a0) * maxR;
    let x3 = x + Math.cos(a1) * maxR;
    let y3 = y + Math.sin(a1) * maxR;

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    if (rounded)
        ctx.arc(x, y, r, a0, a1);
    else
        ctx.lineTo(x1, y1);
    ctx.lineTo(x3, y3);
    if (rounded)
        ctx.arc(x, y, maxR, a1, a0, true);
    else
        ctx.lineTo(x2, y2);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();
}

doNoteAttack = (pitch, volume) => {
    let octave = Math.floor(pitch / noteCount);
    let strength = volume / 127;
    noteAttacks.push({
        octave,
        hasAttacked: false,
        strength
    })
}

spawnEnemy = (section) => {
    enemies[section].push({
        angle: -((section + 0.5) / noteCount) * 2 * Math.PI,
        hp: 5,
        distance: 500
    });
}

window.onload = setup;