const net = require('net');
const server = net.createServer();
const JSONDuplexStream = require('json-duplex-stream');
const Gateway = require('./modules/gateway');

server.on('connection', handleConnection);
server.listen(8000, function() {
  console.log('server listening to %j', server.address());
});

function handleConnection(conn) {
  const s = JSONDuplexStream();
  const gateway = Gateway();
  conn.pipe(s.in).pipe(gateway).pipe(s.out).pipe(conn);

  s.in.on('error', onProtocolError);
  s.out.on('error', onProtocolError);
  conn.on('error', onConnError);

  function onProtocolError(err) {
    conn.end('Protocol Error: ' + err.message);
  }
}

function onConnError(err) {
  console.log('Connection error: ', err.strack);
}
