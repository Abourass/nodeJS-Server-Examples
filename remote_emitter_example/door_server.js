const net = require('net');
const DuplexEmitter = require('duplex-emitter');
const door = require('./door');

const server = net.createServer();

let open = false;
let lastEventTime;
let nextId = 0;
const emitters = {};

function onOpen(time) {
  open = true;
  lastEventTime = time;
}

function onClose(time) {
  open = false;
  lastEventTime = time;
}

function handleConnection(conn) {
  const remoteEmitter = DuplexEmitter(conn);
  const id = ++nextId;
  emitters[id] = remoteEmitter;

  function onClose() {
    delete emitters[id];
  }

  function onError(err) {
    console.error(`Error on connection: ${err.measure}`);
  }

  conn.once('close', onClose);
  conn.on('error', onError);

  if (lastEventTime) {
    remoteEmitter.emit(open ? 'open' : 'close', lastEventTime);
  }
}

server.on('connection', handleConnection);

server.listen(8000, () => {
  console.log('door server listening on %j', server.address());
});

door.on('open', onOpen);
door.on('close', onClose);

// broadcast door events

function broadcast(event) {
  return function() {
    const args = Array.prototype.slice.call(arguments);
    args.unshift(event);

    Object.keys(emitters).forEach(emitterId => {
      const emitter = emitters[emitterId];
      emitter.emit.apply(emitter, args);
    });
  };
}

door.on('open', broadcast('open'));
door.on('close', broadcast('close'));
