const Device = require('./device');
const { getAudio, sendAudio } = require('./audio');
const { getVerificationCode } = require('./utils');
const CODE_LENGTH = 4;

const device = new Device('COM9', 'COM11');

device.call('0987654321');

device.on('calling', () => console.log('calling'));
device.on('rejected', () => console.log('rejected'));
device.on('notAnswered', () => console.log('not answered'));
device.on('hungUp', () => console.log('hung up'));
device.on('endedCall', () => console.log('ended call'));

device.on('answered', () => {
    console.log('answered');
    const code = getVerificationCode(CODE_LENGTH);
    const audio = getAudio(code);
    const callDuration = sendAudio(audio, device);
    setTimeout(() => {
        device.endCall();
        device.emit('endedCall');
    }, callDuration);
});

process.stdin.resume();

const shutDown = (err) => {
    if (err) console.log(err);
    console.log('shut down');
    device.endCall();
    setTimeout(process.exit, 1000);
};

device.on('error', shutDown);
process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);
process.on('beforeExit', shutDown);
process.on('uncaughtException', shutDown);
process.on('unhandledRejection', shutDown);
