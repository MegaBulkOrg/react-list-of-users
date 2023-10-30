import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { INewUserRequest, IUpdateUserArgs, IUser } from '../apiInterfaces';

const SITE =
  process.env.SITE === "undefined" || process.env.SITE === undefined
    ? "localhost"
    : process.env.SITE;

export const usersApi = createApi({
  reducerPath: 'usersApi',
  tagTypes: ['Users'],
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${SITE}:3002/`
  }),
  endpoints: (build) => ({
    getUsersList: build.query<IUser[], number>({
      query: (page) => ({
        url: `users?_page=${page}&_limit=8`
      }),
      providesTags: [{ type: 'Users', id: 'LIST' }]
    }),
    getCurrentUser: build.query<IUser, number>({
      query: (id) => ({
        url: `users/${id}`
      }),
      providesTags: [{ type: 'Users', id: 'LIST' }]
    }),
    checkingUserByEmail: build.query<IUser[], string>({
      query: (email) => ({
        url: `users?email=${email}`
      }),
      providesTags: [{ type: 'Users', id: 'LIST' }]
    }),
    createUser: build.mutation<IUser, INewUserRequest>({
      query: (body) => ({
        url: 'users',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }]
    }),
    updateUser: build.mutation<IUser, IUpdateUserArgs>({
      query: (args) => ({
        url: `users/${args.id}`,
        method: 'PATCH',
        body: args.body
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }]
    })
  })
});

export const { useLazyGetUsersListQuery, useGetCurrentUserQuery, useLazyCheckingUserByEmailQuery, useCreateUserMutation, useUpdateUserMutation } = usersApi