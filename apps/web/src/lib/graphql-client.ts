import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';

export const getClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/shop-api',
      // you can add fetchOptions here if needed
    }),
  });
};
