//deklarace
var svgNS = "http://www.w3.org/2000/svg",
    width,
    height,
    strokeWidth,
    svg,
    player1,
    player2,
    moves = [],
    who = 1,
    end = 0,
    win = 0;

// funkce pro kresleni line
var line = function line(x1, y1, x2, y2, strokeWidth){
    var line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', 'black');
    line.setAttribute('stroke-width', strokeWidth);
    return line;
    }

// funkce pro vytvoreni hraci plochy
var createPlayground = function createPlayground(width, height, containerId){
    var container = document.getElementById(containerId);
    svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    svg.appendChild(line(width / 3, 0, width / 3, height, strokeWidth));
    svg.appendChild(line(width * 2 / 3, 0, width * 2 / 3, height, strokeWidth));
    svg.appendChild(line(width, height / 3, 0, height / 3, strokeWidth));
    svg.appendChild(line(width, height * 2 / 3, 0, height * 2 / 3, strokeWidth));
    container.appendChild(svg);

    }

// funkce pro vytvareni symbolu v matici moves
var createSymbol = function createSymbol(x, y){
    for(i in moves){
        if(moves[i][2] == 1){
            var circle = document.createElementNS(svgNS, 'circle');
            circle.setAttribute("cx", Math.floor(moves[i][0]*(width/3)+(width/6.25)));
            circle.setAttribute("cy", Math.floor(moves[i][1]*(height/3)+(height/6.25)));
            circle.setAttribute("r", (width/12));
            circle.setAttribute("fill", "white");
            circle.setAttribute("stroke", "black")
            circle.setAttribute("stroke-width", strokeWidth);
            svg.appendChild(circle);
        } else{
            var cross = document.createElementNS(svgNS, 'cross');
            svg.appendChild(line(Math.floor(moves[i][0]*(width/3)+(width/11.25)), Math.floor(moves[i][1]*(height/3)+(height/11)), Math.floor(moves[i][0]*(width/3)+(width/4.25)), Math.floor(moves[i][1]*(height/3)+(height/4)), strokeWidth));
            svg.appendChild(line(Math.floor(moves[i][0]*(width/3)+(width/4.25)), Math.floor(moves[i][1]*(height/3)+(height/11)), Math.floor(moves[i][0]*(width/3)+(width/11.25)), Math.floor(moves[i][1]*(height/3)+(height/4)), strokeWidth))
            svg.appendChild(cross);
        }
    }
}

// hlavni funkce ktera si zazada o jmena hracu a vytvori hraci plochu
var main = function main() {
    player1 = prompt("Zadejte jméno hráče O");
    player2 = prompt("Zadejte jméno hráče X");
    document.getElementById("player1").innerHTML = ("Hráč O: " + player1);
    document.getElementById("player2").innerHTML = ("Hráč X: " + player2);

    width = window.innerWidth/1.5;
    height = window.innerHeight;

    strokeWidth = width / 70;

    createPlayground(width, height, 'container');

}

// funkce pro zjistovani viteze
var checkWin = function checkWin() {
    for(i in moves){
        var vert = 0,
        horz = 0,
        tlDiag = 0,
        trDiag = 0;

            for(n in moves){
                if(moves[n][2] == moves[i][2]){
                    if((moves[n][0] == moves[i][0]+1 || moves[n][0] == moves[i][0]-1) && moves[n][1] == moves[i][1]){
                        horz++;
                    }
                    if((moves[n][1] == moves[i][1]+1 || moves[n][1] == moves[i][1]-1) && moves[n][0] == moves[i][0]){
                         vert++;
                    }
                    if((moves[n][0] == moves[i][0]-1 && moves[n][1] == moves[i][1]-1) || (moves[n][0] == moves[i][0]+1 && moves[n][1] == moves[i][1]+1)){
                        tlDiag++;
                    }
                    if((moves[n][0] == moves[i][0]-1 && moves[n][1] == moves[i][1]+1) || (moves[n][0] == moves[i][0]+1 && moves[n][1] == moves[i][1]-1)){
                        trDiag++;
                    }
                }
            }

            // pokud je 9. kolo a zadny vitez tak vypsat remizu
            if(end == 9 && horz == 0 && vert == 0 && tlDiag == 0 && trDiag == 0 ){
                alert("Remíza");
            }

            // pokud je vitez, tak vypis
            if(horz > 1 || vert > 1 || tlDiag > 1 || trDiag > 1){
                if(who == 1 && win == 0){
                    alert("Vyhrál hráč " + player2 + "!");
                    win = 1;
                } else if(who == -1 && win ==0) {
                    alert("Vyhrál hráč " + player1 + "!");
                    win = 1;
                }
            }
    }
}

// na kliknuti ve vymezenem prostoru a pokud neni vitez zjistim jestli pole uz nebylo zmacknuto, pokud ne zapisu a vytvorim symbol
window.onclick = function(e){
    if((Math.floor((e.pageX+(width-innerWidth)/2)/(width/3))) >= 0 && (e.pageX + (width-innerWidth)/2) < width && e.pageY < height && win == 0){
        var cX = Math.floor((e.pageX+(width-innerWidth)/2)/(width/3));
        var cY = Math.floor(e.pageY/(height/3));

        var alreadyClicked = false;

        for(i in moves){
            if(moves[i][0] == cX && moves[i][1] == cY){
                alreadyClicked = true;
            }
        }

        if(alreadyClicked == false){
            moves[(moves.length)] = [cX, cY, who];
            who = who*-1;
            end++;
            createSymbol(cX, cY);
            checkWin();
        }
    }
}

// funkce pro tlacitko Novy hraci
var new_players = function new_players(){
    location.reload();
}

// funkce pro tlacitko Dalsi kolo
var next_round = function next_round(){
    moves = [],
    who = 1,
    end = -1,
    win = 0;

    container.removeChild(svg);

    createPlayground(width, height, 'container');
}

main();