import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@workos-inc/authkit-react';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

function slugifyUsername(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 24);
}

function buildName(authUser) {
  const fullName = [authUser?.firstName, authUser?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  if (fullName) {
    return fullName;
  }

  if (authUser?.email) {
    return authUser.email.split('@')[0];
  }

  return 'Nexus Member';
}

function buildUsername(authUser) {
  const candidates = [
    authUser?.username,
    authUser?.email?.split('@')[0],
    authUser?.firstName,
    authUser?.id,
  ];

  for (const candidate of candidates) {
    if (candidate) {
      const username = slugifyUsername(candidate);
      if (username) {
        return username;
      }
    }
  }

  return `member_${Math.random().toString(36).slice(2, 10)}`;
}

export function useCurrentUser() {
  const { user: authUser, isLoading: isAuthLoading } = useAuth();
  const {
    isLoading: isConvexAuthLoading,
    isAuthenticated: isConvexAuthenticated,
  } = useConvexAuth();
  const createUser = useMutation(api.users.createUser);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const createdForWorkosIdRef = useRef(null);

  const workosId =
    authUser?.id ?? authUser?.userId ?? authUser?.sub ?? authUser?.sid ?? null;
  const isAuthenticated = Boolean(authUser && workosId);

  const convexUser = useQuery(
    api.users.getUserByWorkosId,
    isAuthenticated ? { workosId } : 'skip',
  );

  useEffect(() => {
    if (
      isAuthLoading ||
      !isAuthenticated ||
      convexUser !== null ||
      isCreatingUser ||
      createdForWorkosIdRef.current === workosId
    ) {
      return;
    }

    let isMounted = true;

    const ensureUser = async () => {
      setIsCreatingUser(true);

      try {
        await createUser({
          workosId,
          email: authUser?.email ?? `${buildUsername(authUser)}@example.com`,
          name: buildName(authUser),
          username: buildUsername(authUser),
        });
        createdForWorkosIdRef.current = workosId;
      } catch (error) {
        console.error('Failed to create Convex user record:', error);
      } finally {
        if (isMounted) {
          setIsCreatingUser(false);
        }
      }
    };

    if (convexUser === null) {
      void ensureUser();
    }

    return () => {
      isMounted = false;
    };
  }, [
    authUser,
    convexUser,
    createUser,
    isAuthenticated,
    isAuthLoading,
    isCreatingUser,
    workosId,
  ]);

  const isLoading = useMemo(() => {
    if (isAuthLoading) {
      return true;
    }

    if (!isAuthenticated) {
      return false;
    }

    return (
      isConvexAuthLoading ||
      convexUser === undefined ||
      convexUser === null ||
      isCreatingUser
    );
  }, [
    convexUser,
    isAuthenticated,
    isAuthLoading,
    isConvexAuthLoading,
    isCreatingUser,
  ]);

  return {
    user: convexUser ?? null,
    isLoading,
    isAuthenticated: isAuthenticated && isConvexAuthenticated,
    isAdmin: convexUser?.role === "admin",
  };
}

export default useCurrentUser;
