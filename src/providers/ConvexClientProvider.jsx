import React, { useCallback, useMemo } from 'react';
import { useAuth } from '@workos-inc/authkit-react';
import { ConvexProviderWithAuth, ConvexReactClient } from 'convex/react';

export const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

function useWorkOSConvexAuth() {
  const { isLoading, user, getAccessToken } = useAuth();

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }) => {
      if (!user) {
        return null;
      }

      try {
        return await getAccessToken({
          forceRefresh: forceRefreshToken,
        });
      } catch (error) {
        console.error('Failed to fetch WorkOS access token for Convex', error);
        return null;
      }
    },
    [getAccessToken, user],
  );

  return useMemo(
    () => ({
      isLoading,
      isAuthenticated: Boolean(user),
      fetchAccessToken,
    }),
    [fetchAccessToken, isLoading, user],
  );
}

export function ConvexClientProvider({ children }) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useWorkOSConvexAuth}>
      {children}
    </ConvexProviderWithAuth>
  );
}

export default ConvexClientProvider;
