import { gql } from "@apollo/client/core";

export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
      refreshToken
      user {
        id
        name
        databaseId
        email
      }
    }
  }
`;

export const LOGIN_WITH_FIREBASE = gql`
  mutation LoginWithFirebase($idToken: String!) {
    loginWithFirebase(input: {idToken: $idToken}) {
      authToken
      refreshToken
      user {
        id
        name
        databaseId
        email
      }
    }
  }
`;
