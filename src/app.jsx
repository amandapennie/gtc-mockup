import styles from './index.scss';
import React from 'react';
import Range from 'react-range';


export default class App extends React.Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      init: true,
      conferenceSystem: {},
    }

    this.ws = null;
  }

  handleSocketMessage(event) {
  	var msg = JSON.parse(event.data);
  	console.log("Message: "+ event.data)
  	this.setState({init: false, conferenceSystem: msg});
  }

  sendCommand(command, data) {
  	this.ws.send(JSON.stringify({command, data}));
  }

  componentWillMount() {
  	var self = this;
  	this.ws = new WebSocket("ws://127.0.0.1:3030/conference-system-websocket");
    this.ws.onmessage = this.handleSocketMessage.bind(this);
    this.ws.onopen = function (event) {
      console.log("Socket Ready"); 
      self.sendCommand('init');
    };
  }

  startAdvertising() {
  	this.sendCommand('startAdvertising');
  }

  stopAdvertising() {
  	this.sendCommand('stopAdvertising');
  }

  disconnect() {

  }

  handleValueChange(name, event) {
    this.sendCommand('valueChange', {name, value:event.target.value});
  }

  render() {
  	if (this.state.init) {
	  	return (
			<div className={styles.container}>
				<h1>Starting Up...</h1>
			</div>
	    )
  	}

    const { conferenceSystem } = this.state;

    let connection = null;
    if(conferenceSystem.ble !=="poweredOn"){
    	connection = <span>Bluetooth not on</span>;
    }else if(conferenceSystem.connected) {
      connection = <div><span>Connected </span><a href="#" onClick={this.disconnect.bind(this)}>disconnect</a></div>;
    }else if(!conferenceSystem.advertising) {
    	connection = <a href="#" onClick={this.startAdvertising.bind(this)}>Start Advertising</a>;
    }else if(conferenceSystem.advertising) {
    	connection = <a href="#" onClick={this.stopAdvertising.bind(this)}>Stop Advertising</a>;
    }else{
    	connection = <span>Unknown</span>;
    }

    return (
		<div className={styles.container}>
			<div className={styles.conferenceSystemWrapper}>
			    <h2>{conferenceSystem.name}</h2>
			    <div className={styles.conferenceSystem} >

			    </div>
			</div>
			<div className={styles.conferenceSystemControl}>
			    <h2>Controls</h2>
			    <div>Bluetooth State: { conferenceSystem.ble }</div>
			    <div>
			    	Connection: {connection}
			    </div>
          <div style={{marginTop:15}}>
            <h4>Conference System Service:</h4>
            Availability: {conferenceSystem.availability} <br />
            <Range
              className='slider'
              onMouseUp={(event) => this.handleValueChange('availability', event)}
              type='range'
              value={conferenceSystem.availability}
              min={0}
              max={100} />
          </div>
			</div>
		</div>
    )
  }
}
