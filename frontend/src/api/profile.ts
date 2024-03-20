import axios from 'axios';
import { GoogleUserInfo } from '../types/oauth';

export const getProfile = async (token: string): Promise<GoogleUserInfo> => {
  const resp = await axios.get<GoogleUserInfo>(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  );

  return resp.data;
};
