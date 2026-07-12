import { authClient } from '../utility/auth-client.ts'; //import the auth client
import type { SetStateAction, Dispatch } from 'react';

export async function handleLogIn(
  email: string,
  password: string,
  setOpenError: Dispatch<SetStateAction<boolean>>,
  setErrMsg: Dispatch<SetStateAction<string>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  redirectTo: string,
) {
  await authClient.signIn.email(
    {
      email,
      password,
      callbackURL: redirectTo,
      rememberMe: true,
    },
    {
      onRequest: () => {
        console.log('the user has request login');
        setIsLoading(true);
      },
      onSuccess: () => {
        setIsLoading(false);
      },
      onError: (ctx) => {
        console.log(ctx.request);
        console.log(ctx.response);
        setOpenError(true);
        setErrMsg(ctx.error.message);
        setIsLoading(false);
      },
    },
  );
}
