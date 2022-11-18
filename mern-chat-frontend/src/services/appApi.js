import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const appApi = createApi({
    reducerPath: "appApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5001",
    }),

    endpoints: (builder) => ({
        // crea utente
        signupUser: builder.mutation({
            query: (user) => ({
                url: "/users",
                method: "POST",
                body: user,
            }),
        }),

        // login
        loginUser: builder.mutation({
            query: (user) => ({
                url: "/users/login",
                method: "POST",
                body: user,
            }),
        }),

        // logout

        logoutUser: builder.mutation({
            query: (payload) => ({
                url: "/logout",
                method: "DELETE",
                body: payload,
            }),
        }),

        addFriend: builder.mutation({
            query: (payload) => ({
                url: "/users/addfriend",
                method: "POST",
                body: payload,
            }),
        }),
        
        // modifica dati
        updateUser: builder.mutation({
            query: (user) => ({
                url: "/users/update",     
                method: "POST",
                body: user,
            }),
        }),
    }),
});

export const { useSignupUserMutation, useLoginUserMutation, useLogoutUserMutation, useUpdateUserMutation, useAddFriendMutation } = appApi;

export default appApi;