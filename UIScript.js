window.onload = function createDiv(){
    

    //obscuro = #64534A
    //claro = #E3CEAA
    //margen = #291E0C
    
    
    
    console.log("SI");
    var chessBoard = document.getElementById("rowContainers");
    
    for(var j = 0;j<8;j++){
        var row = document.createElement("div");
        
        row.style.margin = "0px";
        row.style.padding = "0px";
        row.style.height = "11.2vh";
        
        for(var i= 0;i<8;i++){
            var square = document.createElement("div");
           
            square.style.width = "11.2vh";
            square.style.height = "11.2vh";
            square.style.margin = "0px";
            square.style.display = "inline-block";
            
            var color;
            if(j%2 == 0){
                if(i%2 ==0)color = "#64534A";
                else color = "#E3CEAA";
            }
            
            if(j%2 != 0){
                if(i%2 ==0) color = "#E3CEAA";    
                else color = "#64534A"; 
                    
            }
            
            square.style.background = color;
            
            
            
            row.appendChild(square);
        }
        chessBoard.appendChild(row);
    }
  
    
}
