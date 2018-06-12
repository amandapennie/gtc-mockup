var util = require('util');
var bleno = require('bleno');

var ConferenceSystemAvailabilityCharacteristic = require('./characteristics/availability');

function ConferenceSystemService(conferenceSystem, context) {
    bleno.PrimaryService.call(this, {
        uuid: '13333333333333333333333333333339',
        characteristics: [
            new ConferenceSystemAvailabilityCharacteristic(conferenceSystem, context),
        ]
    });
}

util.inherits(ConferenceSystemService, bleno.PrimaryService);

module.exports = ConferenceSystemService;