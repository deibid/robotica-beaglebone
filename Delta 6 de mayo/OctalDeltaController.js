// Creates a websocket with socket.io
 
// Make sure to install socket.io: terminal, goto /var/lib/cloud9 and enter: npm install socket.io
// Installing this takes a few minutes; make sure to wait until the installation is compelete
var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var url = require('url');

var b = require('octalbonescript');
 
 
 
 
var port = 8090;

var on = false;


var gpioOn = 0;
var servoFrecuency = 550;

var g_max = 0.32;
var g_min = 0.86;

 
/*Incializacion de Pins. NO mover a una funcion, deben ser globales */

var userLed = "USR0";

var servo1 = {pin : "P8_13", ready : false, on : false};
var servo2 = {pin : "P8_19", ready : false, on : false};
var servo3 = {pin : "P9_21", ready : false, on : false};
var servo4 = {pin : "P9_22", ready : false, on : false};

var servos = [servo1,servo2,servo3,servo4];

/*Incializacion de Pins. NO mover a una funcion, deben ser globales */


//var htmlFile = "UIDelta.html";
var htmlFile = "debug.html";
 
app.listen(port);
 
// socket.io options go here
 
io.set('log level', 2);   // reduce logging - set 1 for warn, 2 for info, 3 for debug
io.set('browser client minification', true);  // send minified client
io.set('browser client etag', true);  // apply etag caching logic based on version number
 
console.log('Server running on: http://' + getIPAddress() + ':'+port);
 



initialize(); 
 
 
 
io.sockets.on('connection', function (socket) {
    
  
  socket.on('moveServo',function(instruction){
      
      var pin = instruction.pin;
      var value = instruction.value;
      servoFrecuency = instruction.frecuency;
   
      
      console.log("---------------------------");
      console.log("PIN ->" + pin);
      console.log("VALUE ->" + value);
      console.log("FRECUENCY ->" + servoFrecuency);
      
      
      var servo = getServo(pin);
      
      
      if(servo.ready){
          if(value==0){
              console.log("b.stopAnalog en pin: "+servo.pin);
              b.stopAnalog(servo.pin,analogStopCallback);   
          }
          else if(value > g_max && value < g_min){
              console.log("b.analogWrite en pin: "+servo.pin);
              b.analogWrite(servo.pin,value,servoFrecuency,analogWriteCallback);
          }
          else if(value == 'max'){
             console.log("b.analogWrite MAX en pin: "+servo.pin);
              b.analogWrite(servo.pin,0.32,servoFrecuency,analogWriteCallback); 
          }
          
           else if(value == 'min'){
             console.log("b.analogWrite MIN en pin: "+servo.pin);
              b.analogWrite(servo.pin,g_min,servoFrecuency,analogWriteCallback); 
          }
          
          
      }
      else{
          console.log("Servo: "+ servo.pin + "no listo");
      }
      
  });
  
  
    socket.on('moveAll',function(instruction){
       
       var frecuency = instruction.frecuency;
       
       
       console.log(servos[0].pin + " con valor: "+instruction.servo1val + " a "+frecuency+"Hz");
       console.log(servos[1].pin + " con valor: "+instruction.servo2val + " a "+frecuency+"Hz");
       console.log(servos[2].pin + " con valor: "+instruction.servo3val + " a "+frecuency+"Hz");
       console.log(servos[3].pin + " con valor: "+instruction.servo4val + " a "+frecuency+"Hz");
       
        b.analogWrite(servos[0].pin,instruction.servo1val,frecuency,analogWriteCallback);
        b.analogWrite(servos[1].pin,instruction.servo2val,frecuency,analogWriteCallback);
        b.analogWrite(servos[2].pin,instruction.servo3val,frecuency,analogWriteCallback);
        b.analogWrite(servos[3].pin,instruction.servo4val,frecuency,analogWriteCallback);
       
       
       
       
        
    });
 
  
 });
 
 
 
 
 
 

 
/*Funciones auxiliares a socket.io. No Tocar */ 
function handler (req, res) {
 
    var pathname = url.parse(req.url).pathname;
    console.log("Request for " + pathname + " received.");

    res.writeHead(200);

    if(pathname == "/") {
        html = fs.readFileSync(htmlFile, "utf8");
        res.write(html);
    } else if (pathname == "/UIScript.js") {
        script = fs.readFileSync("UIScript.js", "utf8");
        res.write(script);
    }else if (pathname == "/UIStyle.css") {
        script = fs.readFileSync("UIStyle.css", "utf8");
        res.write(script);
    }


    res.end();
    
    
    
    
  }
function getIPAddress() {
 
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }
 
  return '0.0.0.0';
}



function initialize(){
   
    for (var i=0;i<servos.length; i++){
        b.pinMode(servos[i].pin,b.ANALOG_OUTPUT,pinModeCallback);
    }

    
}



function pinModeCallback(error,pin){
    
    
    if(error == null) console.log("Pin "+pin+" habilitado");
    else console.log("Error "+error.message+" en el pin "+pin);
    
    b.stopAnalog(pin,analogStopCallback);
    getServo(pin).ready = true;
    
    
}



function analogStopCallback(error){
    
    if(error == null) console.log("analogStop completado");
    else console.log("Error en el pin: " + pin2 + " analogStop-> " + error.message);
    
}


function analogWriteCallback(error){
    if(error == null) console.log("analogWrite en pin:  completado");
    else console.log("Error en el pin:  analogWrite-> "+error.message);
}


function getServo(pin){
    
    for(var i = 0; i<servos.length; i++){
        if(servos[i].pin == pin) {
            console.log("servo devueto: "+pin);
            return servos[i];
        }
    }
    
}