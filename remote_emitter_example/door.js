const EventEmitter = require('events').EventEmitter;
const door = new EventEmitter();
let open = false;

function emitLater() {
  setTimeout(() => {
    open = !open; // flip state
    const event = open ? 'open' : 'close';
    door.emit(event, Date.now());
    emitLater();
  }, Math.floor(Math.random() * 5000));
}

emitLater();

module.exports = door;
