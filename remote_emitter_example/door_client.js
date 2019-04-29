const net = require('net');
const DuplexEmitter = require('duplex-emitter');
const hostname = process.argv[2];
const port = Number(process.argv[3]);
const timeoutSecs = Number(process.argv[4]);
let timeout;
let warned = false;
const conn = net.connect(port, hostname);
const remoteEmitter = DuplexEmitter(conn);

function onTimeout() {
  warned = true;
  console.error('DOOR OPEN FORM MORE THAN %d SECONDS, GO CLOSE IT!!!', timeoutSecs);
}

function onOpen() {
  const time = setTimeout(onTimeout, timeoutSecs * 1e3);
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

remoteEmitter.on('open', onOpen);
remoteEmitter.on('close', onClose);
