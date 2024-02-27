import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from 'Redux/store';
import { IAuthRequest, IAuthResponse, IUpdateUserArgs, IUserAddInfoResponse, IUserCreate, IUserInfo } from '../apiInterfaces';

const SITE =
  process.env.SITE === "undefined" || process.env.SITE === undefined
    ? "localhost"
    : process.env.SITE;

export const usersApi = createApi({
  reducerPath: 'usersApi',
  tagTypes: ['Users'],
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${SITE}:1002/`,
    prepareHeaders: (headers, { getState }) => {
      const authToken = (getState() as RootState).auth.accessToken
      const regToken = (getState() as RootState).auth.regToken
      if (authToken) headers.set('Authorization', `Bearer ${authToken}`)
      if (regToken) headers.set('Authorization', `Bearer ${regToken}`)
    }
  }),
  endpoints: (build) => ({
    getUsersList: build.query<IUserInfo[], number>({
      query: (page) => ({
        url: `users-info?_page=${page}&_limit=8`
      }),
      providesTags: [{ type: 'Users', id: 'LIST' }]
    }),
    getCurrentUser: build.query<IUserInfo, number>({
      query: (id) => ({
        url: `users-info/${id}`
      }),
      providesTags: [{ type: 'Users', id: 'LIST' }]
    }),
    getCurrentUserEmail: build.query<IUserAddInfoResponse, number>({
      query: (id) => ({
        url: `users/${id}`
      }),
      providesTags: [{ type: 'Users', id: 'LIST' }]
    }),
    signin: build.mutation<IAuthResponse, IAuthRequest>({
      query: (body) => ({
        url: 'signin',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }]
    }),
    signup: build.mutation<IAuthResponse, IAuthRequest>({
      query: (body) => ({
        url: 'signup',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }]
    }),
    createNewUserInfo: build.mutation<IUserInfo, IUserCreate>({
      query: (body) => ({
        url: 'users-info',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }]
    }),
    updateUser: build.mutation<IUserInfo, IUpdateUserArgs>({
      query: (args) => ({
        url: `users-info/${args.id}`,
        method: 'PATCH',
        body: args.body
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }]
    }),
    // для проверки email на дубли при его изменении
    getUserByEmail: build.query<IUserAddInfoResponse[], string>({
      query: (email) => ({
        url: `users?email=${email}`
      }),
      providesTags: [{ type: 'Users', id: 'LIST' }]
    })
  })
});

export const { 
  useLazyGetUsersListQuery,
  useGetCurrentUserQuery,
  useGetCurrentUserEmailQuery,
  useSigninMutation,
  useSignupMutation,
  useCreateNewUserInfoMutation,
  useUpdateUserMutation,
  useLazyGetUserByEmailQuery
} = usersApi