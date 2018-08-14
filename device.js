const SerialPort = require('serialport');
const events = require('events');

class Device extends events.EventEmitter {

    constructor(cmdPort, voicePort) {
        super();
        this.cmdPort = new SerialPort('\\\\.\\' + cmdPort);
        this.voicePort = new SerialPort('\\\\.\\' + voicePort);
        
        this.cmdPort.on('readable', () => {
            const cmd = this.cmdPort.read().toString().trim();
            if (cmd === 'RINGBACK')              this.emit('calling');
            if (cmd === 'VOICE NO CARRIER : 17') this.emit('rejected');
            if (cmd === 'VOICE NO CARRIER : 19') this.emit('notAnswered');
            if (cmd === 'ANSWER')                this.emit('answered');
            if (cmd === 'HANGUP: 1')             this.emit('hungUp');
        });
    }

    call(to) {
        this.cmdPort.write('ATD' + to + ';\r\n');
    }

    endCall() {
        this.cmdPort.write('AT+CHUP\r\n');
    }

    writeToVoicePort(data) {
        this.voicePort.write(data);
    }

}

module.exports = Device;
