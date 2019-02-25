// ---------------------------------------------------------------------------
// Server Example: Capitalizing Service
// Flaws: This example does not provide back-flow, so if the rate at which the
// client sends characters is lower than the rate it receives (for example, if
// the downstream available bandwidth is higher than the upstream one), our
// process memory will grow until exhausted. What we need here is a mechanism
// by which the incoming TCP stream is paused if the level of memory pending
// on the outgoing buffer gets high enough.
// Solution: See Capitalizing Service 2 - capitalizingServer2.js
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

  conn.setEncoding('utf8'); // ---------------------------------> This makes the connection pass strings when emitting data events rather than a raw buffer
  // -----------------------------------------------------------> Since the socket object can emit several events: a 'data' event, a 'close' event, and an 'error' event we should log them
  conn.on('data', onConnData); // ------------------------------> When the 'data' event is emitted, we log it, as well who it was from
  conn.once('close', onConnClose); // --------------------------> When the 'close' event is emitted, we log who closed connection
  conn.on('error', onConnError); // ----------------------------> When the 'error' event is emitted, we log the error, and who caused the error to be emitted

  function onConnData(d) {
    console.log('connection data from %s: %j', remoteAddress, d);
    conn.write(d.toUpperCase()) // -----------------------------> A simple JS transform to uppercase
  }
  function onConnClose() {
    console.log('connection from %s closed', remoteAddress);
  }
  function onConnError(err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  }
}
