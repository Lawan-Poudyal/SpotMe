export type ApiFailurePayload = {
  success: false;
  err : {
      message : string | null;
      name : string | null;
  }
};

