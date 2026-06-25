import { api } from '../config/axios';
import axios from 'axios';

type successResponseType = {
    accessToken : string | null;
    accessTokenExpiresAt : Date | null;
    scopes : string[] | null;
    idToken : string | null; 
    name : string | null;
    msg : string | null;
}


type failureType = {
    success : boolean;
}


export type responseType =(successResponseType) & failureType 

const getAccessToken = async (userId: string ) : Promise<responseType|undefined>  => {
  try {
    const response = await api.get('/api/driveAPI', {
      params: {
        ownerId: userId,
      },
    });
    return { success: true, ...response?.data?.data as successResponseType};
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
	return {success : false , ...err.response?.data as successResponseType}
    }
  }
};

export {getAccessToken}


