// --------------------------------------------------------------------------------
// A simple string-capitaliser stream
// Here we uppercase a chunk, making sure that it's encoded as a String first.
// --------------------------------------------------------------------------------
const inherits = require('util').inherits;
const Transform = require('stream').Transform; // ---------------------------------> The exported stream will have inherited from the core Transform stream, allowing us to provide a duplex stream

function CapitalizingTransformStream(options) { // --------------------------------> Make a call to transform the chunk, so we can capitalize whatever chunk is sent
  Transform.call(this, options);
}

inherits(CapitalizingTransformStream, Transform); // ------------------------------> Inherit the core Transform stream, and implement the _transform method.
// --------------------------------------------------------------------------------> This method receives a chunk of data (could be a raw buffer, an encoded string, etc..), the encoding of the chunk, and a callback.
// --------------------------------------------------------------------------------> Once the transformation is done, the callback is called with either, an error (as the first argument), or the transformed chunk (as the second argument)
// _transform

function _transform(chunk, encoding, callback) { // -------------------------------> Makes sure we get a string by changing the data to represented as a string
  if (encoding === 'buffer') chunk = chunk.toString();
  callback(null, chunk.toUpperCase());
}

CapitalizingTransformStream.prototype._transform = _transform;

module.exports = CapitalizingTransformStream; // ----------------------------------> We're exporting a constructor for a string-capitaliser stream
