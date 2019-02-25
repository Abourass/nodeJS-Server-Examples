// ---------------------------------------------------------------------------
// Server Example: Raw TCP Echo Server
// Desc: This example allows us to connect via TCP and returns logs on error,
// connection, disconnection, as well as returning the raw buffer from the
// string provided.
// ---------------------------------------------------------------------------
const net = require('net');

const server = net.createServer(); // --------------------------> Creating a server object by calling .createServer on the net module
server.on('connection', handleConnection); // ------------------> Bind the handleConnection function to the connection event
//--------------------------------------------------------------> Every time the server makes a new TCP connection, it emits the 'connection' event, passing in the socket object
server.listen(9000, function() { // ----------------------------> Have the server listen on port 9000
  console.log('server listening to %j', server.address()); // --> Log the server address where it's listening
});

function handleConnection(conn) { // ---------------------------> Here we create a function that logs when a new TCP connection is established
  const remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);
// -------------------------------------------------------------> Since the socket object can emit several events: a 'data' event, a 'close' event, and an 'error' event we should log them
  conn.on('data', onConnData); // ------------------------------> When the 'data' event is emitted, we log it, as well who it was from
  conn.once('close', onConnClose); // --------------------------> When the 'close' event is emitted, we log who closed connection
  conn.on('error', onConnError); // ----------------------------> When the 'error' event is emitted, we log the error, and who caused the error to be emitted

  function onConnData(d) {
    console.log('connection data from %s: %j', remoteAddress, d);
  }

  function onConnClose() {
    console.log('connection from %s closed', remoteAddress);
  }

  function onConnError(err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  }
}
