
export type LoginResponse = {
  success: boolean;
  message: string;
  name?: string;
  status: 'initial' | 'success' | 'error';
  role?: string;
  token?: string;
};