"use strict";
// here true means error exists for the field and false means the error doesn't exists for the field
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPasswordValidity = exports.checkEmailValidity = exports.checkUsernameValidity = void 0;
const checkUsernameValidity = (userName) => {
    userName = userName.trim();
    const totalLength = userName.length;
    if (totalLength >= 8)
        return false;
    else
        return true;
};
exports.checkUsernameValidity = checkUsernameValidity;
const checkEmailValidity = (email) => {
    email = email.trim();
    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(email);
};
exports.checkEmailValidity = checkEmailValidity;
const checkPasswordValidity = (password) => {
    password = password.trim();
    const passwordSymbolRegex = /[^a-zA-Z0-9]+/;
    const passwordNumberRegex = /[0-9]+/;
    const passwordLength = password.length;
    return { symbol: !passwordSymbolRegex.test(password), num: !passwordNumberRegex.test(password), totalLength: !(passwordLength >= 8) };
};
exports.checkPasswordValidity = checkPasswordValidity;
//# sourceMappingURL=formValidation.js.map