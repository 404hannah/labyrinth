/* Sources:
- CS50's Introduction to Artificial Intelligence with Python 2020 by CS50
- What School Didn't Tell You About Mazes #SoMEpi by Mattbatwings
*/

let nodes = [[], []];
let path = [];
let solveArr = [];
let popArr = [];

let isSolve = false;
let startNode, finNode;
let solSwitch = true;

let colSta = "purple";
let colFin = "white";
let colCel = "plum";
let colSol = "magenta";

main();

function main(){
    mazeBase();
    startFinGen();
    search(startNode);
}

function mazeBase(){
    let baseHTML = '';

    // Assigning id according to the position
    for(let i = 1; i <= 18; i++){
        nodes[i] = [];
        for(let j = 1; j <= 32; j++){
            nodes[i][j] = {};
            let cell;
            let id;
            
            if (j <= 9) {
                id = `${i}0${j}`;
            } else {
                id = `${i}` + `${j}`;
            }

            cell = `
                    <div class="cell" id="cell-${id}" onclick=""></div>
                `;
            
            nodeInit(i, j, id);
            
            // Adding borders
            // Determine true or false if borders contains something
            if(i == 1){
                // First row
                borderInit(i, j, "top");
            } else if (i == 18){
                // Last row
                borderInit(i, j, "bottom");
            }
            
            if(j == 1){
                // First column
                borderInit(i, j, "left");
            } else if (j == 32){
                // Last column
                borderInit(i, j, "right");
            }

            adjacentInit(i, j, id);

            baseHTML += cell;
        }
    }

    document.querySelector('.maze-ctr').innerHTML = baseHTML;
}

function nodeInit(i, j, id){
    nodes[i][j] = {
        id: id,
        conn: [],
        adjacents: [],
        // Check syntax
        borders: [],
        isStart: false,
        isFinish: false,
        isTravelled: false,
    };
}

function borderInit(i, j, border){
    nodes[i][j]["borders"].push(border);
}

function adjacentInit(i, j, id){
    if (nodes[i][j]["borders"].length == 0){
        // Top
        nodes[i][j]["adjacents"].push(Number(Number(id) - 100));
        // Left
        nodes[i][j]["adjacents"].push(Number(Number(id) - 1));
        // Right
        nodes[i][j]["adjacents"].push(Number(Number(id) + 1));
        // Bottom
        nodes[i][j]["adjacents"].push(Number(Number(id) + 100));

    } else if (nodes[i][j]["borders"].includes("top") && nodes[i][j]["borders"].includes("left")){
        // Right
        nodes[i][j]["adjacents"].push(Number(Number(id) + 1));
        // Bottom
        nodes[i][j]["adjacents"].push(Number(Number(id) + 100));

    } else if (nodes[i][j]["borders"].includes("top") && nodes[i][j]["borders"].includes("right")){
        // Left
        nodes[i][j]["adjacents"].push(Number(Number(id) - 1));
        // Bottom
        nodes[i][j]["adjacents"].push(Number(Number(id) + 100));
    
    } else if (nodes[i][j]["borders"].includes("bottom") && nodes[i][j]["borders"].includes("left")){
        // Top
        nodes[i][j]["adjacents"].push(Number(Number(id) - 100));
        // Right
        nodes[i][j]["adjacents"].push(Number(Number(id) + 1));

    } else if (nodes[i][j]["borders"].includes("bottom") && nodes[i][j]["borders"].includes("right")){
        // Top
        nodes[i][j]["adjacents"].push(Number(Number(id) - 100));
        // Left
        nodes[i][j]["adjacents"].push(Number(Number(id) - 1));

    } else if (nodes[i][j]["borders"].includes("top")){
        // Left
        nodes[i][j]["adjacents"].push(Number(Number(id) - 1));
        // Right
        nodes[i][j]["adjacents"].push(Number(Number(id) + 1));
        // Bottom
        nodes[i][j]["adjacents"].push(Number(Number(id) + 100));

    } else if (nodes[i][j]["borders"].includes("bottom")){
        // Top
        nodes[i][j]["adjacents"].push(Number(Number(id) - 100));
        // Left
        nodes[i][j]["adjacents"].push(Number(Number(id) - 1));
        // Right
        nodes[i][j]["adjacents"].push(Number(Number(id) + 1));
    
    } else if (nodes[i][j]["borders"].includes("left")){
        // Top
        nodes[i][j]["adjacents"].push(Number(Number(id) - 100));
        // Right
        nodes[i][j]["adjacents"].push(Number(Number(id) + 1));
        // Bottom
        nodes[i][j]["adjacents"].push(Number(Number(id) + 100));

    } else if (nodes[i][j]["borders"].includes("right")){
        // Top
        nodes[i][j]["adjacents"].push(Number(Number(id) - 100));
        // Left
        nodes[i][j]["adjacents"].push(Number(Number(id) - 1));
        // Bottom
        nodes[i][j]["adjacents"].push(Number(Number(id) + 100));
        
    }
}

function startFinGen(){
    let borderCells = [];
    // Collect all cells that are borders
    for(let i = 1; i <= 18; i++){
        for(let j = 1; j <= 32; j++){
            if(nodes[i][j]["borders"].length != 0){
                borderCells.push(nodes[i][j]["id"]);
            }
        }
    }

    // w3schools attribution:
    let rngStart = Math.floor((Math.random() * borderCells.length) + 1);

    let start = borderCells[rngStart - 1];
    let rngFin = rngStart;

    let i, j;
    if (start.length == 4) {
        i = Number(start.substring(0, 2));
        j = Number(start.substring(2, 4));
    } else if (start.length == 3) {
        i = Number(start.substring(0, 1));
        j = Number(start.substring(1, 3));
    }

    // Finalizing start
    if(nodes[i][j]["id"] === start){
        nodes[i][j]["isStart"] = true;
        document.getElementById("cell-" + String(nodes[i][j]["id"])).style.backgroundColor = colSta;
        startNode = nodes[i][j];
    } 

    while(rngStart === rngFin){
        rngFin = Math.floor((Math.random() * borderCells.length) + 1);
    }

    let fin = borderCells[rngFin - 1];
    if (fin.length == 4) {
        i = Number(fin.substring(0, 2));
        j = Number(fin.substring(2, 4));
    } else if (fin.length == 3) {
        i = Number(fin.substring(0, 1));
        j = Number(fin.substring(1, 3));
    }

    // Finalizing finish
    if (nodes[i][j]["id"] === fin){
        nodes[i][j]["isFinish"] = true;
        document.getElementById("cell-" + String(nodes[i][j]["id"])).style.backgroundColor = colFin;
        finNode = nodes[i][j];
    }
}

var adjNode;
function search(node){
    // Depth-first search (Dfs)
    path.push(node);
    node["isTravelled"] = true;
    
    node = adjChecker(node);
    if (node === "end"){
        return;
    }

    var solAdj = false;
    if(!isSolve){
        // Adding of wrongly popped paths
        while(solAdj == false){
            if(solveArr.length == 0){
                break;
            }
            
            let x, y;
            for (let i = 0; i < node["adjacents"].length; i++){
                element = node["adjacents"][i];
                if (String(element).length == 4) {
                    x = Number(String(element).substring(0, 2));
                    y = Number(String(element).substring(2, 4));
                } else if (String(element).length == 3) {
                    x = Number(String(element).substring(0, 1));
                    y = Number(String(element).substring(1, 3));
                }

                if(solveArr[solveArr.length - 1]["id"] === nodes[x][y]["id"]){
                    solAdj = true;
                }
            }
    
            if(!solAdj){
                solveArr.push(popArr.pop());
            }
        }
        solveArr.push(node);
    }

    if(node["isFinish"] == true){
        isSolve = true;
    }

    // Choosing one of the adjacent cells
    let bool2 = true;
    while(bool2 == true){
        rngConn = Math.floor((Math.random() * node["adjacents"].length) + 1);

        let i, j;
        if (String(node["adjacents"][rngConn - 1]).length == 4) {
            i = Number(String(node["adjacents"][rngConn - 1]).substring(0, 2));
            j = Number(String(node["adjacents"][rngConn - 1]).substring(2, 4));
        } else if (String(node["adjacents"][rngConn - 1]).length == 3) {
            i = Number(String(node["adjacents"][rngConn - 1]).substring(0, 1));
            j = Number(String(node["adjacents"][rngConn - 1]).substring(1, 3));
        }
    
        adjNode = nodes[i][j];
        bool2 = adjNode["isTravelled"];
    }

    // Usage of property "none" is attributed to Nicky Reinert (Medium article).
    // Only works in top row and partially works in rightmost row
    // Top, Left, Right, Bottom
    if (Number(node["id"] - 100) == Number(adjNode["id"])){
        // From
        document.getElementById("cell-" + String(node["id"])).style.borderTop = "none";
        // To
        document.getElementById("cell-" + String(adjNode["id"])).style.borderBottom = "none";
    } else if (Number(node["id"] - 1) == Number(adjNode["id"])){
        // From
        document.getElementById("cell-" + String(node["id"])).style.borderLeft = "none";
        // To
        document.getElementById("cell-" + String(adjNode["id"])).style.borderRight = "none";
    } else if (Number(Number(node["id"]) + 1) == Number(adjNode["id"])){
        // From
        document.getElementById("cell-" + String(node["id"])).style.borderRight = "none";
        // To
        document.getElementById("cell-" + String(adjNode["id"])).style.borderLeft = "none";
    } else if (Number(Number(node["id"]) + 100) == Number(adjNode["id"])){
        // From
        document.getElementById("cell-" + String(node["id"])).style.borderBottom = "none";
        // To
        document.getElementById("cell-" + String(adjNode["id"])).style.borderTop = "none";
    }

    if (adjNode["isFinish"] == false){
        document.getElementById("cell-" + String(adjNode["id"])).style.backgroundColor = colCel;
    } else {
        document.getElementById("cell-" + String(adjNode["id"])).style.backgroundColor = colFin;
    }
    
    search(adjNode);
}

function adjChecker(node){
    let bool = false;

    // To determine if all adjacent cells are travelled
    node["adjacents"].forEach(element => {
        element = String(element);
        let i, j;
        if (element.length == 4) {
            i = Number(element.substring(0, 2));
            j = Number(element.substring(2, 4));
        } else if (element.length == 3) {
            i = Number(element.substring(0, 1));
            j = Number(element.substring(1, 3));
        }
        if (nodes[i][j]["isTravelled"] == false){
            bool = true;
        }
    });

    if(!bool){
        // Checks if all cells are travelled, the function ends
        if (path.length == (18*32)){
            return "end";
        } else {
            var index;
            for(let i = 0; i < path.length; i++){
                if (path[i] == node){
                    index = i;
                }
            }
           
            if (!isSolve){
                if(solveArr.length != 0){
                    // Start node is never popped
                    if(solveArr.length != 1){
                        popArr.push(solveArr.pop());
                    }
                }
            }

            // Get the previous cell
            return adjChecker(path[index - 1]);
        }
        
    } else {
        return node;
    }
}

function gen(){
    document.getElementById("solve").innerText = "Solve";
    solSwitch = true;

    nodes = [[], []];
    path = [];
    startNode = "";
    finNode = "";
    solveArr = [];
    isSolve = false;
    solSwitch = true;
    popArr = [];

    main();
}

function solve(){
    if(solSwitch){
        document.getElementById("solve").innerText = "Clear";
        solSwitch = false;
        solveArr.forEach(element => {
            console.log("Painting: ", element["id"]);
            if(element["isFinish"] == true){
                document.getElementById("cell-" + String(element["id"])).style.backgroundColor = colFin;
            } else if (element["isStart"] == true){
                document.getElementById("cell-" + String(element["id"])).style.backgroundColor = colSta;
            } else {
                document.getElementById("cell-" + String(element["id"])).style.backgroundColor = colSol;
            }
        });
    } else {
        document.getElementById("solve").innerText = "Solve";
        solSwitch = true;
        solveArr.forEach(element => {
            if(element["isFinish"] == true){
                document.getElementById("cell-" + String(element["id"])).style.backgroundColor = colFin;
            } else if (element["isStart"] == true){
                document.getElementById("cell-" + String(element["id"])).style.backgroundColor = colSta;
            } else {
                document.getElementById("cell-" + String(element["id"])).style.backgroundColor = colCel;
            }
        });
    }
}