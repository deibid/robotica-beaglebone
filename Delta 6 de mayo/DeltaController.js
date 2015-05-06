// Creates a websocket with socket.io
 
// Make sure to install socket.io: terminal, goto /var/lib/cloud9 and enter: npm install socket.io
// Installing this takes a few minutes; make sure to wait until the installation is compelete
 var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var b = require('bonescript');
var url = require('url');
 
var port = 8090;

var on = false;
var pwm1On = false;
var pwm2On = false;
var pwm3On = false;

var gpioOn = 0;

var servoFrecuency = 2000;


//var htmlFile = "UIDelta.html";
var htmlFile = "debug.html";
 
app.listen(port);
 
// socket.io options go here
 
io.set('log level', 2);   // reduce logging - set 1 for warn, 2 for info, 3 for debug
io.set('browser client minification', true);  // send minified client
io.set('browser client etag', true);  // apply etag caching logic based on version number
 
console.log('Server running on: http://' + getIPAddress() + ':'+port);
 
 
/*Incializacion de Pins. NO mover a una funcion, deben ser globales */

var userLed = "USR0";

var servo1 = "P8_13";
var servo2 = "P8_19";
var servo3 = "P9_31";

var GPIO = "P8_14";

b.pinMode(userLed,b.OUTPUT);
b.pinMode(GPIO, 'out');






/*Incializacion de Pins. NO mover a una funcion, deben ser globales */


initialize();
 
 
 
io.sockets.on('connection', function (socket) {
    
    
    
  socket.on('userLed', function(){
     
     
     if(!on){
     b.digitalWrite(userLed,b.HIGH); 
     on = true;
     }
     else{
         b.digitalWrite(userLed,b.LOW);
         on = false;
         
     }
     
     console.log("userLed prendido");
  });
 
 
 
  socket.on('pwm1',function(){
    console.log("PWM1");
    
    
      
      
        if(!pwm1On){
        b.analogWrite(servo1,0.5,servoFrecuency,analogWriteCallback);
        pwm1On = true;
          
        }
        else{
          b.analogWrite(servo1,0,servoFrecuency,analogWriteCallback);
          pwm1On = false;
        }
        
    
    
    
  });
  
  
  socket.on('pwm2',function(){
    console.log("PWM2");
     
        if(!pwm2On){
        b.analogWrite(servo2,0.5,servoFrecuency,analogWriteCallback);
        pwm2On = true;
          
        }
        else{
          b.analogWrite(servo2,0,servoFrecuency,analogWriteCallback);
          pwm2On = false;
        }
   
    
  });
  
  
  socket.on('pwm3',function(){
    console.log("PWM3");
    console.log("----------");
        if(!pwm3On){
        b.analogWrite(servo3,0.5,servoFrecuency,analogWriteCallback);
        pwm3On = true;
          
        }
        else{
          b.analogWrite(servo3,0,servoFrecuency,analogWriteCallback);
          pwm3On = false;
        }

  });
  
//   socket.on('gpio',function(){
    
//     console.log("GPIO");
//     gpioOn = gpioOn ? 0 : 1;
//     b.digitalWrite(GPIO, gpioOn);
    
    
//   });
  
  
 
  
 });
 
 



 
 
/*Funciones auxiliares a socket.io. No Tocar */ 
function handler (req, res) {
 
 /*
  if (req.url == "/favicon.ico"){   // handle requests for favico.ico
  res.writeHead(200, {'Content-Type': 'image/x-icon'} );
  res.end();
  console.log('favicon requested');
  return;
  }

  fs.readFile('index.html',    // load html file
  function (err, data) {
 
      if(req.url == "/UIStyle.css"){
        res.writeHead(200,{'Content-Type' : 'text/css'});
        console.log('CSS');
        res.write(data);
        res.end();
        
        return;
      }
     
      if(req.url == "/UIScript.js"){
        res.writeHead(200,{'Content-Type' : 'text/javascript'});
        console.log('Javascript');
        res.write(data);
        res.end();
        
        return;
      }
     
     
        if (err) {
          res.writeHead(500);
          return res.end('Error loading index.html');
        }
     
        res.writeHead(200);
        res.end(data);
        
  }
        
        
        */
        
        
        
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
  
  b.analogWrite(servo1,0.2,1000,analogWriteCallback);
  
  
  b.analogWrite(servo2,0.2,1000,analogWriteCallback);
  
  
  b.analogWrite(servo3,0.2,1000,analogWriteCallback);

}



function analogWriteCallback(x){
  
  
  if(x != null){
    console.log("Error " + x.err);
  }
  console.log("pinhabilitado");
}