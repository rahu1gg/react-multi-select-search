import { ThemeProvider } from '@/client/providers/theme-provider';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Fragment } from 'react/jsx-runtime';

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <Fragment>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </ThemeProvider>
    </Fragment>
  ),
});
