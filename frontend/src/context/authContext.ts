import type { AuthContextType } from '@/interface/authContext';
import { createContext } from 'react';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);