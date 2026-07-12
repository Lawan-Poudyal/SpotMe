import { authClient } from '../utility/auth-client';
import type { Dispatch, SetStateAction } from 'react';

export async function requestDriveScope(
  event: string,
  setError: Dispatch<SetStateAction<string>>,
  setSubTitleError: Dispatch<SetStateAction<string>>,
) {
  const { error } = await authClient.linkSocial({
    provider: 'google',
    scopes: ['https://www.googleapis.com/auth/drive.file'],
    callbackURL: `/dashboard/${event}`, // come back to where they were
  });

  if (error) {
    setError('Linking Failure');
    setSubTitleError('Some failure occured while increasing the scope');
    console.error('Drive scope linking failed:', error);
  }
}
