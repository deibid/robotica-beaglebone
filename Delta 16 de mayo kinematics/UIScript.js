var colorLight = "rgba(227, 206, 170,1)"; //claro = #E3CEAA
var colorDark =  "rgba(100, 83, 74,1)";  //obscuro = #64534A
var colorSelected = "rgba(53, 123, 202,0.7)"; 
var colorGoButtonEnabled = "rgba(27, 107, 23,1)";
var colorGoButtonDisabled = "rgba(27, 107, 23,0.5)";

var origin = "00";
var destination = "00";

var originColor;
var destinationColor;

var originLabel;
var destinationLabel;

var goButton;



window.onload = function createDiv(){


   
    
    goButton = document.getElementById("goButton");
    


    
    
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
        goButtonStateChange(true);

    }

    else if(origin != "00" && destination == "00"){

        goButtonStateChange(true);
        console.log("Caso 1");
        if(square.id == origin){
            square.style.background = originColor;
            origin = "00";
            goButtonStateChange(true);
        }
        else{
            destination = square.id;
            destinationColor = color;
            square.style.background = colorSelected;
            goButtonStateChange(false);
        }

    }

    else if(origin == "00" && destination != "00"){

        
        console.log("Caso 2");
         if(square.id == destination){
            square.style.background = destinationColor;
            destination = "00";
             goButtonStateChange(true);
             
        }
        else{
            origin = square.id;
            originColor = color;
            square.style.background = colorSelected;
            goButtonStateChange(false);
        }

    }


    else if(origin != "00" && destination != "00"){

        goButtonStateChange(false);
        
        console.log("Caso 3");
        console.log("final origin "+ origin);
        console.log("final destination "+ destination);

        if(square.id == destination){
            destination = "00";
            square.style.background = destinationColor;
            goButtonStateChange(true);
        }
        if(square.id == origin){
            origin = "00";
            square.style.background = originColor;
            goButtonStateChange(true);
        }

    }

    console.log("ORIGIN " + origin);
    console.log("DESTINATION " + destination);

    formatCoordinates();




}


function goButtonStateChange(flag){
    
    if(flag){
        goButton.disabled = true;
        goButton.style.backgroundColor = colorGoButtonDisabled;
    }
    else{
        goButton.disabled = false;
        goButton.style.backgroundColor = colorGoButtonEnabled;
    }
}

function formatCoordinates(){

    
    originLabel.textContent = "[" + origin.charAt(0) + "-" + origin.charAt(1) + "]";
    destinationLabel.textContent= "[" + destination.charAt(0) + "-" + destination.charAt(1) + "]";

}
