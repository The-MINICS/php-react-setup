
export type LoginResponse = {
  success: boolean;
  message: string;
  name?: string;
  role?: string;
  token?: string;
};