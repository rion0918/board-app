'use client';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/lib/apollo-client';

const theme = extendTheme({}); // 必須（これで型も正しく補完される）

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <ApolloProvider client={client}>
        {children}
      </ApolloProvider>
    </ChakraProvider>
  );
}