function $(elem) {
    return document.querySelector(elem);
}
// duplicate admin pannel content on the admin left pannel
$('#admin-left').innerHTML = $('#admin').innerHTML;

// ELEMENTS
let container = $('#container');
let canva = $('#canva');
let hidder = $('#hidder');
let modalTitle = $('#modal-title');
let modalContent = $('#modal-content');
let modalFooter = $('#modal-footer');
// ---

container.addEventListener('mousedown', function(e) {
    click = true;
})

container.addEventListener('mouseup', function(e) {
    click = false;
})

// SET DEBUG
let debug = false; // set to true to see neighbot in view
if (!debug) {
    $('#debug').style.border = 'none';
}
// ---

// const definition
const DEFAULT_SIZE_VALUE = 8;
const DEFAULT_FULLSIZE_VALUE = 500;
// ---

let size = DEFAULT_SIZE_VALUE;
let fullSize = DEFAULT_FULLSIZE_VALUE;
let grid = true;
let canvas = [];
let click = false;
let w = fullSize/size;
let h = fullSize/size;
let maps = [];

function getLocaleMaps() {
    maps = localStorage.maps;
    if (maps === undefined) {
        maps = [];
    }
    else {
        maps = JSON.parse(maps);
    }
    console.log("maps: ", maps);
    saveLocaleMaps(maps);
}

function saveMap() {
    let name = window.prompt("Enter map name : ");
    while (name == "") {
        name = window.prompt("You MUST enter a name.");
    }
    if (name == null) {
        return;
    }
    else {
        maps.push({
            name: name,
            size: size,
            canvas: canvas
        });
        saveLocaleMaps(maps);
    }
}

function saveLocaleMaps(m) {
    localStorage.maps = JSON.stringify(m);
}

function showLoadMap() {
    hidder.style.display = "block";
    modalTitle.innerHTML = "Load a map";
    let HTML = "";
    maps.forEach(element => {
        HTML += "<a onclick='loadMap(\""+element.name+"\");'>"+element.name+"</a><br><div class='map-details'>( size: "+element.size+" )</div><br>";
    });
    if (HTML == "") {
        HTML += "<p style='font-size: 18px; text-align: center;'>No maps to load.</p>";
    }
    modalContent.innerHTML = HTML;
}

function getMap(name) {
    for (let i = 0; i < maps.length; i++) {
        const element = maps[i];
        if (element.name == name) {
            return element;
        }
    }
}

function closeModal() {
    hidder.style.display = "none";
}

function loadMap(name) {
    let map = getMap(name);
    size = map.size;
    grid = false;
    resetMap();
    canvas = map.canvas;
    drawCanvas();
}

function clearTable() {
    canvas = [];
}

function setSize(val) {
    size = (val != "") ? parseInt(val,10) : DEFAULT_SIZE_VALUE;
}

function setFullSize(val) {
    fullSize = (val != "") ? parseInt(val,10) : DEFAULT_FULLSIZE_VALUE;
}

function toggleGrid() {
    grid = !grid;
    drawCanvas();
}

function resetMap() {
    clearTable();
    click = false;
    w = fullSize/size;
    h = fullSize/size;
    buildBlock();
    drawCanvas();
}

function buildBlock() {
    container.style.width = fullSize+"px";
    container.style.height = fullSize+"px";
    canva.width = fullSize;
    canva.height = fullSize;
    canva.style.width = fullSize+"px";
    canva.style.height = fullSize+"px";
    let html = "";
    for (let i = 0; i < size; i++) {
        html += "<span style='height: "+(100/size)+"%'>";
        let containerClass = (debug) ? "canva-debug" : "";
        for (let j = 0; j < size; j++) {
            html += "<div onClick='clickCanva("+((i*size)+j)+")' onMouseOver='toggleCanva("+((i*size)+j)+")' style='width: "+(100/size)+"%; height: 100%' id='canva"+((i*size)+j)+"' class='canva "+containerClass+"'>"
            +((i*size)+j)+"</div>";
            canvas.push(false);
        }
        html += "</span>";
    }
    container.innerHTML = html;
}

function toggleCanva(id) {
    if (click) {
        canvas[id] = !canvas[id];
        drawCanvas();
    }
}

function debugg(id) {
    let html = "";
    html += (isTopLeft(id)) ? "<div class='debug isTopLeft'></div>" : "";
    html += (isTop(id)) ? "<div class='debug isTop'></div>" : "";
    html += (isTopRight(id)) ? "<div class='debug isTopRight'></div>" : "";
    html += (isRight(id)) ? "<div class='debug isRight'></div>" : "";
    html += (isBottomRight(id)) ? "<div class='debug isBottomRight'></div>" : "";
    html += (isBottom(id)) ? "<div class='debug isBottom'></div>" : "";
    html += (isBottomLeft(id)) ? "<div class='debug isBottomLeft'></div>" : "";
    html += (isLeft(id)) ? "<div class='debug isLeft'></div>" : "";
    $('#debug').innerHTML = html;
}

function clickCanva(id) {
    canvas[id] = !canvas[id];
    drawCanvas();
    if (debug) {
        debugg(id);
    }
}

function drawCanvas() {
    closeModal();
    var c = document.getElementById("canva");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, fullSize, fullSize);
    let drawElem = [];
    let drawBorders = [];
    canvas.forEach((element, key) => {
        if (element) {
            drawElem.push(key);
        }
        else {
            drawBorders.push(key);
        }
    });
    drawBorders.forEach(element => {
        drawBorder(element);
    });
    drawElem.forEach(element => {
        drawCanva(element);
    });
}


function isNeighbor(id) {
    if (id < 0 || id > (size*size)-1) {
        return false;
    }
    else {
        return canvas[id];
    }
}

function isTop(id) {
    return isNeighbor(id-size);
}
function isLeft(id) {
    return isNeighbor(id-1);
}
function isTopLeft(id) {
    return isNeighbor(id-size-1);
}
function isTopRight(id) {
    return isNeighbor(id-size+1);
}
function isRight(id) {
    return isNeighbor(id+1);
}
function isBottom(id) {
    return isNeighbor(id+size);
}
function isBottomLeft(id) {
    return isNeighbor(id+size-1);
}
function isBottomRight(id) {
    return isNeighbor(id+size+1);
}

function drawBorder(id) {
    if (grid) {
        var c = document.getElementById("canva");
        var ctx = c.getContext("2d");
        let x = Math.floor((id%size))*w;
        let y = Math.floor((id/size))*w;
        ctx.beginPath();
        ctx.strokeStyle = "#efefef";
        ctx.lineWidth="1";
        ctx.moveTo(x,y);
        ctx.lineTo(x+(fullSize/size),y);
        ctx.lineTo(x+(fullSize/size),y+(fullSize/size));
        ctx.lineTo(x,y+(fullSize/size));
        ctx.lineTo(x,y);
        ctx.stroke();
    }
}

function drawCanva(id) {
    var c = document.getElementById("canva");
    var ctx = c.getContext("2d");
    let x = Math.floor((id%size))*w;
    let y = Math.floor((id/size))*w;
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth="1";
    ctx.moveTo(x,y);
    // Line 1
    if (!isTop(id)) {
        ctx.lineTo(x+(fullSize/size),y);
    }
    else {
        ctx.moveTo(x+(fullSize/size),y);
    }
    // ---
    // Line 2
    if (!isRight(id)) {
        ctx.lineTo(x+(fullSize/size),y+(fullSize/size));
    }
    else {
        ctx.moveTo(x+(fullSize/size),y+(fullSize/size));
    }
    // ---
    // Line 3
    if (!isBottom(id)) {
        ctx.lineTo(x,y+(fullSize/size));
    }
    else {
        ctx.moveTo(x,y+(fullSize/size));
    }
    // ---
    // Line 4
    if (!isLeft(id)) {
        ctx.lineTo(x,y);
    }
    else {
        ctx.moveTo(x,y);
    }
    // ---
    // Line 5
    if (!isLeft(id) && !isTop(id)) {
        ctx.lineTo(x+((fullSize/size)/2),y-((fullSize/size)/2));
    }
    else {
        ctx.moveTo(x+((fullSize/size)/2),y-((fullSize/size)/2));
    }
    // ---
    // Line 6
    if (!isTop(id) && !isTopRight(id)) {
        ctx.lineTo(x+((fullSize/size)*1.5),y-((fullSize/size)/2));
    }
    else {
        ctx.moveTo(x+((fullSize/size)*1.5),y-((fullSize/size)/2));
    }
    // ---
    // Line 7
    if (!isRight(id) && !isTop(id) && !isTopRight(id)) {
        ctx.lineTo(x+(fullSize/size),y);
    }
    else {
        ctx.moveTo(x+(fullSize/size),y);
    }
    // ---
    ctx.moveTo(x+((fullSize/size)*1.5),y-((fullSize/size)/2));
    // Line 8
    if (!isRight(id) && !isTopRight(id)) {
        ctx.lineTo(x+((fullSize/size)*1.5),y+((fullSize/size)/2));
    }
    else {
        ctx.moveTo(x+((fullSize/size)*1.5),y+((fullSize/size)/2));
    }
    // ---
    // Line 9
    if (!isRight(id) && !isBottom(id)) {
        ctx.lineTo(x+(fullSize/size),y+((fullSize/size)));
    }
    else {
        ctx.moveTo(x+(fullSize/size),y+((fullSize/size)));
    }
    // ---
    // special line A
    if (!isTop(id) && isTopRight(id)) {
        ctx.moveTo(x+((fullSize/size)/2),y-((fullSize/size)/2));
        ctx.lineTo(x+(fullSize/size),y-((fullSize/size)/2));
    }
    if (!isRight(id) && isTopRight(id)) {
        ctx.moveTo(x+(fullSize/size)*1.5,y+((fullSize/size)/2));
        ctx.lineTo(x+(fullSize/size)*1.5,y);
    }
    // ---
    if (!isRight(id) && isBottom(id) && isBottomRight(id)) {
        ctx.moveTo(x+((fullSize/size)*1.5),y+((fullSize/size)/2));
        ctx.lineTo(x+(fullSize/size),y+((fullSize/size)));
    }
    ctx.stroke();
}


// main programm
buildBlock();
drawCanvas();
getLocaleMaps();