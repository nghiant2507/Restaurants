'use client';
import { AppProgressProvider as ProgressProvider } from '@bprogress/next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

import { LayoutWrapper } from '~/components/Layout/LayoutWrapper';
import { Toaster } from '~/core/components/ui/sonner';
import { GlobalContextProvider } from '~/core/contexts';

const queryClient = new QueryClient();

export const LayoutTheme = ({ children }: { children: ReactNode }) => {
  return (
    <GlobalContextProvider store={{ isLoading: true }}>
      <QueryClientProvider client={queryClient}>
        <LayoutWrapper>
          <ProgressProvider height="4px" color="#0a0a0a">
            {children}
          </ProgressProvider>
        </LayoutWrapper>
        <Toaster />
      </QueryClientProvider>
    </GlobalContextProvider>
  );
};
