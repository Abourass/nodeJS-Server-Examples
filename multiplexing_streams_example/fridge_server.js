const net = require('net');
const DuplexEmitter = require('duplex-emitter');
const Mux = require('mux-demux');
const server = net.createServer();
server.on('connection', handleConnection);
server.listen(8000, () => {
  console.log('door server listening on %j', server.address());
});

// sensors
const sensors = [
  {
    name: 'door',
    events: ['open', 'close'],
    emitter: require('./door'),
    remotes: {},
    nextId: 0,
    lastEvent: undefined,
  },
  {
    name: 'temperature',
    events: ['reading'],
    emitter: require('./thermometer'),
    remotes: {},
    nextId: 0,
    lastEvent: undefine,
  },
];

// handle connections
function handleConnection(conn) {
  const mx = Mux();
  conn.on('error', onError);
  mx.on('error', onError);
  conn.pipe(mx).pipe(conn);
  sensors.forEach(attachSensor);
  function attachSensor(sensor) {
    const stream = mx.createWriteStream(sensor.name);
    const remoteEmitter = DuplexEmitter(stream);
    stream.once('close', onClose);
    stream.on('error', onError);
    mx.on('error', onError);
    // add remote to sensor remotes
    const id = ++sensor.nextId;
    sensor.remotes[id] = remoteEmitter;
    if (sensor.lastEvent) {
      remoteEmitter.emit.apply(remoteEmitter, sensor.lastEvent);
    }

    function onClose() {
      deletesensor.remotes[id];
    }
  }

  function onError(err) {
    conn.destroy();
    console.error(`Error on connection: ${err.message}`);
  }
}
// broadcast all sensor events to connections
sensors.forEach(sensor => {
  sensor.events.forEach(event => {
  // broadcast all events of type `event`
    sensor.emitter.on(event, broadcast(event, sensor.remotes));
    // store last event on `sensor.lastEvent`
    sensor.emitter.on(event, function() {
      const args = Array.prototype.slice.call(arguments);
      args.unshift(event);
      sensor.lastEvent = args;
    });
  });
});

function broadcast(event, remotes) {
  return function() {
    const args = Array.prototype.slice.call(arguments);
    args.unshift(event);
    Object.keys(remotes).forEach(emitterId => {
      const remote = remotes[emitterId];
      remote.emit.apply(remote, args);
    });
  };
}
