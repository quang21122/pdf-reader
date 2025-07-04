'use client'

import React from 'react'
import { ApolloProvider as ApolloClientProvider } from '@apollo/client'
import apolloClient from '@/graphql/client'

interface ApolloProviderProps {
  children: React.ReactNode
}

export default function ApolloProvider({ children }: ApolloProviderProps) {
  return (
    <ApolloClientProvider client={apolloClient}>
      {children}
    </ApolloClientProvider>
  )
}
