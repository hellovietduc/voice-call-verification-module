const { exec } = require('child_process');

const call = (to, code, sipAccount) => {
    if (!Array.isArray(code)) code = code.toString().split('');
    const { server, user, password } = sipAccount;

    return new Promise((resolve, reject) => {
        const intro = 'files/sip/intro.wav';
        const repeat = 'files/sip/repeat.wav';
        const digits = code.map(d => `files/sip/${d}.wav`).join(';');
        const builtAudio = [intro, digits, repeat, digits].join(';');
        exec(
            `java -jar ./lib/sip.jar ${server} ${user} ${password} ${to} ${builtAudio}`,
            { cwd: __dirname },
            (err, stdout) => {
                if (err) reject(err);
                resolve(stdout.trim());
            }
        );
    });
};

module.exports = call;
