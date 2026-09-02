export type passwordError = {
    symbol: boolean;
    num: boolean;
    totalLength: boolean;
};
declare const checkUsernameValidity: (userName: string) => boolean;
declare const checkEmailValidity: (email: string) => boolean;
declare const checkPasswordValidity: (password: string) => passwordError;
export { checkUsernameValidity, checkEmailValidity, checkPasswordValidity };
//# sourceMappingURL=formValidation.d.ts.map