const fs = require('fs');

const getAudio = (code) => {
    if (!Array.isArray(code)) code = code.toString().split('');

    const intro = fs.readFileSync('./files/dcom/intro.wav');
    const repeat = fs.readFileSync('./files/dcom/repeat.wav');
    const digits = [];
    code.forEach(d => digits.push(fs.readFileSync(`./files/dcom/${d}.wav`)));

    const totalLength = intro.length + repeat.length + 2 * digits.reduce((p, c) => p + c.length, 0);
    return Buffer.concat([intro, ...digits, repeat, ...digits], totalLength);
};

const sendAudio = (audio, device) => {
    let i = 0;
    const id = setInterval(() => {
        const part = audio.slice(i * 160, i * 160 + 160);
        if (part.length <= 0) return clearInterval(id);

        device.writeToVoicePort(part);
        i++;
    }, 20);
    return audio.length / 8; // 8 bytes/millisecond
};

module.exports = {
    getAudio,
    sendAudio
};
