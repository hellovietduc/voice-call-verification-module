const getRandInt = (min = 0, max = 9) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getVerificationCode = (codeLength) => {
    const code = [];
    for (let i = 0; i < codeLength; i++) code.push(getRandInt());
    return code;
};

module.exports = {
    getRandInt,
    getVerificationCode
};
