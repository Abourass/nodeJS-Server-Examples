// ---------------------------------------------------------------------------
// Server Example: Capitalizing Service 2 - Service as a stream
// Description: In this example we are implementing the capitalization service
// as a reusable stream. So, rather than listening for TCP 'data' events we
// start a stream, then pipe the connection into the stream, and then the
// stream back into the service
// Additional: See Additional Commenting in ./modules/capitalizingStream.js
// ---------------------------------------------------------------------------
const net = require('net');
const CapitalizingStream = require('./modules/capitalizingStream');

const server = net.createServer(); // --------------------------> Creating a server object by calling .createServer on the net module
server.on('connection', handleConnection); // ------------------> Bind the handleConnection function to the connection event
//--------------------------------------------------------------> Every time the server makes a new TCP connection, it emits the 'connection' event, passing in the socket object
server.listen(9000, function() { // ----------------------------> Have the server listen on port 9000
  console.log('server listening to %j', server.address()); // --> Log the server address where it's listening
});

function handleConnection(conn) { // ---------------------------> Here we create a function that does our logging
  const remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);
  const service = new CapitalizingStream(); // -----------------> We initiate a stream here, rather than listening for TCP 'data' events

  service.once('error', onServiceError); // --------------------> Here we listen for errors on the CapitalizationStream
  conn.once('close', onConnClose);
  conn.on('error', onConnError);
  conn.pipe(service).pipe(conn); // ----------------------------> We pipe the connection into the stream, and pipe the stream back into the service

  function onServiceError(err) {
    conn.end('Error: ' + err.message + '\n'); // ---------------> Log errors from the CapitalizationStream
  }
  function onConnClose() {
    console.log('connection from %s closed', remoteAddress); //-> Log when a connection closes
  }
  function onConnError(err) { // -------------------------------> Log when there is a connection error, we log the error and the user the error is in relation to
    console.log('Connection %s error: %s', remoteAddress, err.message);
  }
}
