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


var rad2deg = 180/Math.PI;

var dec = 3;
 
/***************CONSTANTES DE LA PLANTA****************/

    var Sb = new Number(26.5);
    var Sp = new Number(9.8);
    var L = new Number(12.5);
    var l = new Number(64);
    

    //var Wb = ((Math.sqrt(3) / 6) * Sb);
    var Wb = new Number(15);
    //var Ub = ((Math.sqrt(3) / 3) * Sb);
    var Ub = new Number(20);
    //var Wp = ((Math.sqrt(3) / 6) * Sp);
    var Wp = new Number(7);
    //var Up = ((Math.sqrt(3) / 3) * Sp);
    var Up = new Number(5);
    
  

/***************CONSTANTES DE LA PLANTA****************/
 
 
/*Incializacion de Pins. NO mover a una funcion, deben ser globales */

var userLed = "USR0";

var servo1 = {pin : "P8_13", ready : false, on : false};
var servo2 = {pin : "P8_19", ready : false, on : false};
var servo3 = {pin : "P9_21", ready : false, on : false};
var servo4 = {pin : "P9_22", ready : false, on : false};

var servos = [servo1,servo2,servo3,servo4];

/*Incializacion de Pins. NO mover a una funcion, deben ser globales */


var htmlFile = "UIDelta.html";
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
    
    
    
    socket.on('inverseKinematics', function(posicion){
       
       var x = new Number(posicion.x);
       var y = new Number(posicion.y);
       var z = new Number(posicion.z);
       
       console.log('coordenadas: x-> '+x+' y-> '+y+' z-> '+z);
       
       
       inverseKinematics(x,y,z);
       
        
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






function inverseKinematics(x,y,z){
    
    console.log("en inverse....x,y,z"+x+' '+y+' '+z);
    
   

    var a = new Number(Wb - Up);
    a = new Number(a.toFixed(dec));
    console.log("a-> "+a);
    var b = (Sp / 2 - (Math.sqrt(3) / 2) * Wb)
    b = new Number(b.toFixed(dec));
    console.log("b-> "+b);
    var c = Wp - (1 / 2) * Wb;
    c = new Number(c.toFixed(dec));
    console.log("c-> "+c);

    console.log(typeof a);
    console.log(typeof L);
    console.log(typeof y);


    console.log('L -> '+L);
    var E1 = 2*L*(y + a);
    E1 = new Number(E1.toFixed(dec));
    console.log("E1-> "+E1);
    var F1 = 2 * z * L;
    F1 = new Number(F1.toFixed(dec));
    console.log("F1-> "+F1);
    var G1 = (x * x) + (y * y) + (z * z) + (a * a) + (L * L) + (2 * y * a) - (l * l);
    G1 = new Number(G1.toFixed(dec));
    console.log("G1-> "+G1);

    var E2 = new Number(-L * (Math.sqrt(3) * (x + b) + y + c));
    E2 = new Number(E2.toFixed(dec));
    console.log("E2-> "+E2);
    var F2 = 2 * z * L;
    F2 = new Number(F2.toFixed(dec));
    console.log("F2-> "+F2);
    var G2 = (x * x) + (y * y) + (z * z) + (b * b) + (c * c) + (L * L) + (2 * ((x * b) + (y * c))) - (l * l);
    G2 = new Number(G2.toFixed(dec));
    console.log("G2-> "+G2);

    var E3 = L * (Math.sqrt(3) * (x - b) - y - c);
    E3 = new Number(E3.toFixed(dec));
    console.log("E3-> "+E3);
    var F3 = 2 * z * L;
    F3 = new Number(F3.toFixed(dec));
    console.log("F3-> "+F3);
    var G3 = (x * x) + (y * y) + (z * z) + (b * b) + (c * c) + (L * L) + (2 * ((-x * b) + (y * c))) - (l * l);
    G3 = new Number(G3.toFixed(dec));
    console.log("G3-> "+G3);

    var t1 = (-F1 - Math.sqrt((E1 * E1) + (F1 * F1) - (G1 * G1))) / (G1 - E1);
    t1 = new Number(t1.toFixed(dec));
    console.log("t1-> "+t1);
    var t2 = (-F2 - Math.sqrt((E2 * E2) + (F2 * F2) - (G2 * G2))) / (G2 - E2);
    t2 = new Number(t2.toFixed(dec));
    console.log("t2-> "+t2);
    var t3 = (-F3 - Math.sqrt((E3 * E3) + (F3 * F3) - (G3 * G3))) / (G3 - E3);
    t3 = new Number(t3.toFixed(dec));
    console.log("t3-> "+t3);

    var th1n = (2 * Math.atan(t1)) * rad2deg;
    th1n = new Number(th1n.toFixed(dec));
    var th2n = (2 * Math.atan(t2)) * rad2deg;
    th2n = new Number(th2n.toFixed(dec));
    var th3n = (2 * Math.atan(t3)) * rad2deg;
    th3n = new Number(th3n.toFixed(dec));
    
    
    
    console.log('angulos: th1-> '+th1n+' th2-> '+th2n+' th3-> '+th3n);
    
    
}


