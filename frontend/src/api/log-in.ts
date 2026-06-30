import { authClient } from '../utility/auth-client.ts'; //import the auth client
import type { SetStateAction, Dispatch } from 'react';

export async function handleLogIn(
  email: string,
  password: string,
  rememberMe: boolean,
  setOpenError: Dispatch<SetStateAction<boolean>>,
  setErrMsg: Dispatch<SetStateAction<string>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  redirectTo: string,
) {
  await authClient.signIn.email(
    {
      email, // user email address
      password, // user password -> min 8 characters by default
      callbackURL: redirectTo, // A URL to redirect to after the user verifies their email (optional)
      rememberMe: true,
    },
    {
      onRequest: (ctx) => {
        console.log('the user has request login');
        setIsLoading(true);
      },
      onSuccess: (ctx) => {
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
