import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { boot } from 'quasar/wrappers';
import { provide } from 'vue';
import { DefaultApolloClient } from '@vue/apollo-composable';

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_URI,
});

const authLink = setContext((_, { headers }) => {
  // Lấy token từ localStorage
  const token = localStorage.getItem('authToken');
  // Trả về headers với token nếu có
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});

export default boot(({ app }) => {
  app.provide(DefaultApolloClient, apolloClient);
});
