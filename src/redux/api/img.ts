import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUploadAvatarResponse } from 'Redux/apiInterfaces';

const SITE =
  process.env.SITE === "undefined" || process.env.SITE === undefined
    ? "localhost"
    : process.env.SITE;
const PORT =
  process.env.PORT === "undefined" || process.env.PORT === undefined
    ? 3000
    : process.env.PORT;


export const uploadApi = createApi({
  reducerPath: 'uploadApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${SITE}:${PORT}`
  }),
  endpoints: (build) => ({
    uploadAvatar: build.mutation<IUploadAvatarResponse, FormData>({
      query: (img) => ({
        url: `/upload-avatar`,
        method: 'POST',
        body: img
      }),
    })
  })
});

export const { useUploadAvatarMutation } = uploadApi