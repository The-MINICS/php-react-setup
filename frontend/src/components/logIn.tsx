import { useAuth } from '@/context/useAuth';
import type { LoginResponse } from '@/types/logInResponse';
import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios';
import { useActionState } from 'react';
import { useNavigate } from 'react-router';

async function handleLoginAction(_previousState: LoginResponse, formData: FormData): Promise<LoginResponse> {
  const username = formData.get('username');
  const password = formData.get('password');

  try {
    const response = await axiosInstance.post('/api/auth/login', { username, password });
    const { success, message, role, token } = response.data;
    if (success && role && token) {
      localStorage.setItem('authToken', token);
      return { success: true, status: 'success', message: 'Login successful!', role: role };
    } else {
      return { success: false, status: 'error', message: message || 'Invalid response from server.' };
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      return { success: false, status: 'error', message: error.response.data.message || 'Login failed.' };
    }
    return { success: false, status: 'error', message: 'Network error. Please try again.' };
  }
}

export default function Login() {
  const [state, submitAction, isPending] = useActionState<LoginResponse, FormData>(
    handleLoginAction,
    {
      success: false,
      status: 'initial',
      message: '',
    }
  );
  const { login } = useAuth();
  const navigate = useNavigate();

  if (state.status === 'success' && state.role) {
    login(state.role);
    navigate('/dashboard');
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form action={submitAction}>
        {state.status === 'error' && <p className="error">{state.message}</p>}
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            type="username"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            disabled={isPending}
          />
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
