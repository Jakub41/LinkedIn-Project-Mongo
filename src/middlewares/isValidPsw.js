const passwordValidator = require("password-validator");

//* PASSWORD VALIDATOR
// PW requirements:
// at least 8 chars long but max 64; min 1 uppercase;
// min 1 lowercase; min 1 digits; min 1 symbol; no whitespace
const pwSchema = new passwordValidator();
pwSchema
    .is()
    .min(8)
    .is()
    .max(64)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits()
    .has()
    .symbols()
    .has()
    .not()
    .spaces();

const isValidPsw = password => {
    return pwSchema.validate(password);
};

module.exports = isValidPsw;
