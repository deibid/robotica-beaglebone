var colorLight = "rgba(227, 206, 170,1)";
var colorDark =  "rgba(100, 83, 74,1)";
var colorSelected = "rgba(53, 123, 202,0.7)";


var origin = "00";
var destination = "00";

var originColor;
var destinationColor;

var originLabel;
var destinationLabel;



window.onload = function createDiv(){


    //obscuro = #64534A
    //claro = #E3CEAA
    //margen = #291E0C


    var letters = ['A','B','C','D','E','F','G','H'];



    var chessBoard = document.getElementById("rowContainers");
    var letterArray = document.getElementById("letterArray");

    originLabel = document.getElementById("originLabel");
    destinationLabel = document.getElementById("destinationLabel");
    
    formatCoordinates();



    for(var j = 0;j<8;j++){
        var row = document.createElement("div");


        row.style.margin = "0px";
        row.style.padding = "0px";
        row.style.height = "11.2vh";

        for(var i= 0;i<8;i++){
            var id = letters[j] + (i+1);
            var square = document.createElement("div");

            square.style.width = "11.2vh";
            square.style.height = "11.2vh";
            square.style.margin = "0px";
            square.style.display = "inline-block";
            square.id = id;

            square.setAttribute('onclick','chessClick(id)');

            var color;
            if(j%2 == 0){
                if(i%2 ==0)color = colorDark;
                else color = colorLight;
            }

            if(j%2 != 0){
                if(i%2 ==0) color = colorLight;    
                else color = colorDark; 

            }

            square.style.background = color;



            row.appendChild(square);
        }
        chessBoard.appendChild(row);
    }


}



function chessClick(id){

    console.log("------------------");


    var square =  document.getElementById(id);
    var color = square.style.backgroundColor;



    console.log("origin incial: " + origin);
    console.log("destination inicial: " + destination);

    if(origin == "00" && destination == "00"){

        console.log("Caso 0");
        origin = square.id;
        console.log("origin: "+origin);
        originColor = color;
        square.style.background = colorSelected;

    }

    else if(origin != "00" && destination == "00"){

        console.log("Caso 1");
        if(square.id == origin){
            square.style.background = originColor;
            origin = "00";
        }
        else{
            destination = square.id;
            destinationColor = color;
            square.style.background = colorSelected;
        }

    }

    else if(origin == "00" && destination != "00"){

        console.log("Caso 2");
         if(square.id == destination){
            square.style.background = destinationColor;
            destination = "00";
        }
        else{
            origin = square.id;
            originColor = color;
            square.style.background = colorSelected;
        }

    }


    else if(origin != "00" && destination != "00"){

        console.log("Caso 3");
        console.log("final origin "+ origin);
        console.log("final destination "+ destination);

        if(square.id == destination){
            destination = "00";
            square.style.background = destinationColor;
        }
        if(square.id == origin){
            origin = "00";
            square.style.background = originColor;
        }

    }

    console.log("ORIGIN " + origin);
    console.log("DESTINATION " + destination);

    formatCoordinates();




}


function formatCoordinates(){

    
    originLabel.textContent = "[" + origin.charAt(0) + "-" + origin.charAt(1) + "]";
    destinationLabel.textContent= "[" + destination.charAt(0) + "-" + destination.charAt(1) + "]";

}
