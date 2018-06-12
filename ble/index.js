var util = require('util');
var path = require('path');
var observable = require('observable');
var merge = require('merge');

//
// Require bleno peripheral library.
// https://github.com/sandeepmistry/bleno
//
var bleno = require('bleno');

//
// Conference System
// * has availability
var conferenceSystem = require('./conferenceSystem');

//
// The BLE Conference System Service!
//
var ConferenceSystemService = require('./conferenceSystem/service');

//
// A name to advertise our Conference System Service.
//
var name = 'the Loft';

var _currentStateObservable = observable({
  ble : 'unknown',
  advertising: false,
  connected: false,
  availability: 0,
  name
});

var updateState = function(changes) {
    var c = _currentStateObservable();
    c = merge(c, changes)
    _currentStateObservable(c);
}

var conferenceSystemService = new ConferenceSystemService(new conferenceSystem.ConferenceSystem(), updateState);

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var expressWs = require('express-ws')(app);

app.ws('/conference-system-websocket', function(ws, req) {
  ws.on('message', function(msg) {
    var msg = JSON.parse(msg);
    switch(msg.command) {
      case 'init':
        sendState();
        break;
      case 'startAdvertising':
        bleno.startAdvertising(_currentStateObservable().name, [conferenceSystemService.uuid], function(err) {
          if (err) {console.log(err);}
        });
        break;
      case 'stopAdvertising':
        bleno.stopAdvertising();
        break;
      case 'valueChange':
        var name = msg.data.name;
        var value = msg.data.value;

        var changeset = {};
        changeset[name] = value;
        updateState(changeset);
        break;
      default:
        console.log("Unknown command")
        console.log(msg);
    }
  });
});

var aWss = expressWs.getWss('/conference-system-websocket');

var sendToAll = function(msg) {
  aWss.clients.forEach(function (client) {
    client.send(msg);
  });
}

var sendState = function() {
  sendToAll(JSON.stringify(_currentStateObservable()));
}

// on current state update send state to all clients
_currentStateObservable(( name, old, value ) => { sendState(); });


bleno.on('stateChange', function(state) {
  updateState({ble: state});
});

bleno.on('accept', function(clientAddress) {
  console.log('accept');
  updateState({connected: true});
  bleno.stopAdvertising();
});

// hack to know when disconnect happens on OSX
conferenceSystemService.characteristics[0].on('unsubscribe', function(e){
  updateState({connected: false});
})

bleno.on('advertisingStart', function(err) {
  if (!err) {
    updateState({advertising: true});
    bleno.setServices([
      conferenceSystemService
    ]);
  }else{
    console.log(err);
  }
});

bleno.on('advertisingStop', function(err) {
  if (!err) {
    updateState({advertising: false});
  }else{
    console.log(err);
  }
});

app.listen(3030, function () {
  console.log('WS service listening on port 3030!');
})

