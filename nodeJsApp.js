var net = require('net');
var fs = require('fs');

//var Bitfield = require("bitfield");
var ConnectionCalculator = 0;
//var HOST = '127.0.0.1';
var HOST = '0.0.0.0';
var PORT = 5353;

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
/*
    
    */
/*
net.createServer(function(sock) {
    
    ConnectionCalculator += 1;
    console.log('Number of Connection : ' + ConnectionCalculator);
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    
    sock.on('connection', function(data) {
        console.log( 'Function call for Connection Count : ');
    });
    sock.on('data', function(data) {
              
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        
        sock.write('SERVER : ' + data);
        //sock.end();
        //sock.pipe(sock);
        
    });
    
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        ConnectionCalculator -= 1;
        console.log('Number of Connection : ' + ConnectionCalculator);
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });
    
}).listen(PORT, HOST);
*/

//https://www.hacksparrow.com/tcp-socket-programming-in-node-js.html
//The same thing can be accomplished in a slightly different way. Make sure to include the necessary variables from the last example for this one to work.
//var data = '111011100110111'.split('').map(Number).map(Boolean);
//var field = new Bitfield(data.length);
let newvar = 1;
var server = net.createServer();

server.listen(PORT, HOST => {

    console.log('Server listening on ' + HOST +':'+ PORT);
    console.log('Server listening on ' + server.address().address +':'+ server.address().port);

    //field.set(45, true);

    //field.write('1', 0, "utf-8")
    //buf.write('EE', 1); 
    //newvar = field.get(1)? 1 : 0;
    
    //newvar = field.get(0)? 1 : 0;
    console.log(newvar);
    //console.log(field.buffer);
});

server.on('connection', function(sock) {
    
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
        
    server.getConnections(function(err, count) {
        if(err) throw err;
        console.log( 'Function call for Connection Count : '+ count);
    });


    sock.on('close',function(){
        console.log('Server closed !');
    });


//socket.setEncoding('utf8');

sock.setTimeout(3000,function(){
  // called after timeout -> same as socket.on('timeout')
  // it just tells that soket timed out => its ur job to end or destroy the socket.
  // socket.end() vs socket.destroy() => end allows us to send final data and allows some i/o activity to finish before destroying the socket
  // whereas destroy kills the socket immediately irrespective of whether any i/o operation is goin on or not...force destry takes place
  console.log('Socket timed out');
});

sock.on('timeout',function(){
  console.log('Socket timed out !');
  sock.end('TIMEOUT');
  //can call socket.destroy() here too.
});

sock.on('error',function(error){
  console.log('Error : ' + error);
});

sock.on('data',function(data){
  var bread = sock.bytesRead;
  var bwrite = sock.bytesWritten;
  console.log('Bytes read : ' + bread);
  console.log('Bytes written : ' + bwrite);
  console.log('Data sent to server : ' + data);

  //echo data
  var is_kernel_buffer_full = sock.write('Data ::' + data);
  if(is_kernel_buffer_full){
    console.log('Data was flushed successfully from kernel buffer i.e written successfully!');
  }else{
    sock.pause();
  }

});

sock.on('drain',function(){
  console.log('write buffer is empty now .. u can resume the writable stream');
  sock.resume();
});

sock.on('end',function(data){
  console.log('Socket ended from other end!');
  console.log('End data : ' + data);
});

sock.on('close',function(error){
  var bread = sock.bytesRead;
  var bwrite = sock.bytesWritten;
  console.log('Bytes read : ' + bread);
  console.log('Bytes written : ' + bwrite);
  console.log('Socket closed!');
  if(error){
    console.log('Socket was closed coz of transmission error');
  }
}); 

//600 = 1 Second
setTimeout(function(){
  var isdestroyed = sock.destroyed;
  console.log('Socket destroyed:' + isdestroyed);
  sock.destroy();
},36000);

});

server.maxConnections = 2;

server.on('error',function(error){
  console.log('Error: ' + error);
});

//https://gist.github.com/sid24rane/2b10b8f4b2f814bd0851d861d3515a10
