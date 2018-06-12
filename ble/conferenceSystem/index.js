var util = require('util');
var events = require('events');


function ConferenceSystem() {
  events.EventEmitter.call(this);
  this.availability = 0;
}

util.inherits(ConferenceSystem, events.EventEmitter);

module.exports.ConferenceSystem = ConferenceSystem;