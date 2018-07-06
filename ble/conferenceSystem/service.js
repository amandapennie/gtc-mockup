var util = require('util');
var bleno = require('bleno');

var ConferenceSystemAvailabilityCharacteristic = require('./characteristics/availability');

function ConferenceSystemService(conferenceSystem, context) {
    bleno.PrimaryService.call(this, {
        uuid: 'c578000f18f74db7b03b75ef65007548',
        characteristics: [
            new ConferenceSystemAvailabilityCharacteristic(conferenceSystem, context),
        ]
    });
}

util.inherits(ConferenceSystemService, bleno.PrimaryService);

module.exports = ConferenceSystemService;