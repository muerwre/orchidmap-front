import { AxiosError } from 'axios';
import { PostMapResponse } from '~/utils/api/types';

export const postMapInterceptor = (res: AxiosError<PostMapResponse>) => {
  if (res.response?.data.code) {
    return res.response;
  }

  if (res.response?.data.error) {
    throw new Error(res.response?.data.error);
  }

  throw res;
};
