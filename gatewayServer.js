const net = require('net');
const server = net.createServer();
const JSONDuplexStream = require('json-duplex-stream');
const Gateway = require('./modules/gateway');

server.listen(8000, () => {
  console.log('server listening to %j', server.address());
});

function onConnError(err) {
  console.log('Connection error: ', err.stack);
}

function handleConnection(conn) {
  function onProtocolError(err) {
    conn.end(`Protocol Error: ${err.message}`);
  }
  const s = JSONDuplexStream();
  const gateway = Gateway();
  conn.pipe(s.in)
    .pipe(gateway)
    .pipe(s.out)
    .pipe(conn);
  s.in.on('error', onProtocolError);
  s.out.on('error', onProtocolError);
  conn.on('error', onConnError);
}

server.on('connection', handleConnection);
