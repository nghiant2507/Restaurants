import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { createClientBrowser } from '~/lib/supabase/client';

import { useStore } from './use-store';

interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}

export const useAuth = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useStore<boolean>('isLoading');
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [user, setUser] = useStore<AuthUser | null>('auth-info');
  const supabase = createClientBrowser();

  const handleUnauthenticated = useCallback(() => {
    setUser(null);
    if (pathname !== '/auth') {
      router.push('/auth');
    }
  }, [pathname, router]);

  const handleAuthenticated = useCallback(
    (userData: any) => {  //eslint-disable-line
      if (user?.id === userData.id) return;
      if (userData) {
        setUser({
          id: userData.id,
          email: userData.email,
          user_metadata: userData.user_metadata,
        });

        const hasLoggedInBefore = localStorage.getItem(
          `first-login-${userData.id}`,
        );

        if (!hasLoggedInBefore) {
          toast(`Welcome ${userData.user_metadata?.name || 'user'}`, {
            description: 'Successfully logged in!',
            id: `welcome-${userData.id}`,
          });

          localStorage.setItem(`first-login-${userData.id}`, 'true');
        }
      }
    },
    [user?.id],
  );

  useEffect(() => {
    const handleStorageChange = () => {
      if (user) {
        localStorage.removeItem(`first-login-${user?.id}`);
      }
    };

    return () => {
      handleStorageChange();
    };
  }, [user]);

  const checkAuth = useCallback(async () => {
    if (!user) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          handleAuthenticated(sessionData.session.user);
        } else {
          handleUnauthenticated();
        }
      } catch (error) {
        console.error('Authentication error:', error);
        handleUnauthenticated();
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [supabase, handleUnauthenticated, handleAuthenticated]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setIsSubmit(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast('Đăng nhập thất bại', {
            description: error.message,
          });
          return { success: false, error };
        }

        if (data.user) {
          handleAuthenticated(data.user);
          router.push('/restaurants');
        }

        return { success: true, user: data.user };
      } catch (error) {
        console.error('Sign in error:', error);
        toast('Lỗi đăng nhập', {
          description: 'Có lỗi xảy ra khi đăng nhập',
        });
        return { success: false, error };
      } finally {
        setIsSubmit(false);
      }
    },
    [supabase, handleAuthenticated, router],
  );

  const signOut = useCallback(async () => {
    setIsSubmit(true);
    try {
      const { error } = await supabase.auth.signOut();

      if (!error) {
        toast('Đăng xuất thành công', {
          description: 'Hẹn gặp lại bạn!',
        });
        router.push('/auth');
      } else {
        toast('Đăng xuất thất bại', {
          description: error.message,
        });
      }
    } catch (error) {
      toast('Lỗi đăng xuất', {
        description: 'Có lỗi xảy ra khi đăng xuất',
      });
      console.error('Sign out error:', error);
    } finally {
      setIsSubmit(false);
    }
  }, [router, supabase]);

  const signUp = useCallback(
    async (email: string, password: string, metadata?: object) => {
      setIsSubmit(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: metadata,
          },
        });

        if (error) {
          toast('Đăng ký thất bại', {
            description: error.message,
          });
          return { success: false, error };
        }

        return { success: true, user: data.user };
      } catch (error) {
        console.error('Sign up error:', error);
        toast('Lỗi đăng ký', {
          description: 'Có lỗi xảy ra khi đăng ký',
        });
        return { success: false, error };
      } finally {
        setIsSubmit(false);
      }
    },
    [supabase],
  );

  return {
    isLoading,
    user,
    signIn,
    signOut,
    signUp,
    checkAuth,
    isSubmit,
  };
};
