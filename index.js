const Device = require('./device');
const { getAudio, sendAudio } = require('./audio');
const sipCall = require('./sip');

const devices = new Map();

const shutDown = (err) => {
    if (err) console.log(err);
    console.log('shut down');
    this.endCall();
};

const addDevice = (name, cmdPort, voicePort) => {
    const device = new Device(cmdPort, voicePort);
    device
        .on('calling',     () => console.log('calling'))
        .on('rejected',    () => console.log('rejected'))
        .on('notAnswered', () => console.log('not answered'))
        .on('hungUp',      () => console.log('hung up'))
        .on('endedCall',   () => console.log('ended call'))
        .on('error',       shutDown.bind(device));
    devices.set(name, device);
};

const removeDevice = (name) => {
    return devices.delete(name);
};

const cleanUp = () => {
    for (const [name, device] of devices) {
        device.endCall();
        device.emit('endedCall');
    }
    devices.clear();
};

const call = (to, code, deviceName) => {
    const device = devices.get(deviceName);
    if (!device) return console.log('device not found');

    device.call(to);
    device.on('answered', () => {
        console.log('answered');
        const audio = getAudio(code);
        const callDuration = sendAudio(audio, device);
        setTimeout(() => {
            device.endCall();
            device.emit('endedCall');
        }, callDuration);
    });
};

module.exports = {
    getDevices: () => devices.entries(),
    addDevice,
    removeDevice,
    cleanUp,
    call,
    sipCall
};
