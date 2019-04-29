const Reconnect = require('reconnect-net');
const DuplexEmitter = require('duplex-emitter');
const hostname = process.argv[2];
const port = Number(process.argv[3]);
const timeoutSecs = Number(process.argv[4]);
let timeout;
let warned = false;
const reconnect = Reconnect(onConnect).connect(port, hostname);

reconnect.on('disconnect', () => {
  console.log('disconnected');
});

function onConnect(conn) {
  console.log('connected');
  const remoteEmitter = DuplexEmitter(conn);
  remoteEmitter.on('open', onOpen);
  remoteEmitter.on('close', onClose);
}

function onOpen() {
  timeout = setTimeout(onTimeout, timeoutSecs * 1e3);
}

function onClose() {
  if (warned) {
    warned = false;
    console.log('closed now');
  }
  if (timeout) {
    clearTimeout(timeout);
  }
}

function onTimeout() {
  warned = true;
  console.error('DOOR OPEN FOR MORE THAN %d SECONDS, GO CLOSE IT!!!', timeoutSecs);
}
