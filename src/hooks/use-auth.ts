import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { loginSchema, registerSchema } from '@/schemas/auth.schema';

type User = {
  id: string;
  email: string;
  globalRole: string;
};

type SessionResponse = {
  success: boolean;
  data: {
    user: User;
  };
};

async function fetchSession(): Promise<User | null> {
  const res = await fetch('/api/auth/session');
  if (!res.ok) {
    return null;
  }
  const json: SessionResponse = await res.json();
  return json.data.user;
}

async function loginUser(data: z.infer<typeof loginSchema>): Promise<User> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Login failed');
  return json.data.user;
}

async function registerUser(data: z.infer<typeof registerSchema>): Promise<User> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Registration failed');
  return json.data.user;
}

async function logoutUser(): Promise<void> {
  const res = await fetch('/api/auth/logout', { method: 'POST' });
  if (!res.ok) throw new Error('Logout failed');
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(['session'], data);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      queryClient.setQueryData(['session'], data);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(['session'], null);
    },
  });

  return {
    user: user ?? null,
    isLoading,
    error,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
