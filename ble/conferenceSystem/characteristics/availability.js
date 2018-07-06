var util = require('util');
var bleno = require('bleno');

function ConferenceSystemAvailabilityCharacteristic(conferenceSystem, context) {
  bleno.Characteristic.call(this, {
    uuid: '41bb2d1f4e3b47eb8c6c6d651aa361fd',
    properties: ['read'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'Gets the Conference System availability.'
      })
    ]
  });

  this.conferenceSystem = conferenceSystem;
  this.context = context;
}

util.inherits(ConferenceSystemAvailabilityCharacteristic, bleno.Characteristic);

ConferenceSystemAvailabilityCharacteristic.prototype.onReadRequest = function(offset, callback) {
  if (offset) {
    callback(this.RESULT_ATTR_NOT_LONG, null);
  }
  else {
    var data = new Buffer(2);
    data.writeUInt16BE(this.conferenceSystem.availability, 0);
    callback(this.RESULT_SUCCESS, data);
  }
};

module.exports = ConferenceSystemAvailabilityCharacteristic;