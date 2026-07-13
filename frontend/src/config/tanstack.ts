import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min — data stays fresh this long
      retry: 2, // retry failed requests twice
      throwOnError: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // fires for every failed query globally
      console.error(`Query failed: ${query.queryKey}`, error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      // fires for every failed mutation globally
      console.error('Mutation failed', error);
    },
  }),
});
