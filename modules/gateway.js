const extend = require('util')._extend;
const inherits = require('util').inherits;
const Transform = require('stream').Transform;

const defaultOptions = {
  highWaterMark: 10,
  objectMode: true,
};

function Gateway(options) {
  if (!(this instanceof Gateway)) {
    return new Gateway(options);
  }
  options = extend({}, options || {});
  options = extend(options, defaultOptions);
  Transform.call(this, options);
}

module.exports = Gateway;
inherits(Gateway, Transform);

// Fake Push to queue
function pushToQueue(object, callback) {
  setTimeout(callback, Math.floor(Math.random() * 1000));
}

// _transform
Gateway.prototype._transform = _transform;
function _transform(event, encoding, callback) {
  if (!event.id) return handleError(new Error('event doesn\'t have an \'id\' field'));
  pushToQueue(event, pushed);
  function pushed(err) {
    if (err) {
      handleError(err);
    } else {
      reply = {
        id: event.id,
        success: true,
      };
      callback(null, reply);
    }
  }
  function handleError(err) {
    const reply = {
      id: event.id,
      success: false,
      error: err.message,
    };
    callback(null, reply);
  }
}
