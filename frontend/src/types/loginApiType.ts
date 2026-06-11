
type loginApiErrorMessage = {
    errMsg  : string;
}

export type loginApiType = {
    success : boolean;
    error? : loginApiErrorMessage
}
