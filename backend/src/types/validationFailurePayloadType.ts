export type validationFailurePayloadType = {
    success : boolean;
    err : {
	name : string;
	message  : string;
	details : Record<string , string>[];
    }
}
