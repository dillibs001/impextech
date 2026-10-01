'use client';

import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { ApolloProvider } from '@apollo/client/react';
import { ReactNode } from 'react';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/shop-api',
  cache: new InMemoryCache(),
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}
