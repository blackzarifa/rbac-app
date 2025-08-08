import api from '@/lib/api';
import { LoginInput } from '@/schemas';
import { User } from '@/store/auth.store';

interface LoginResponse {
  access_token: string;
  user: User;
}

export const authService = {
  async login(data: LoginInput): Promise<LoginResponse> {
    return api.post<LoginResponse>('/auth/login', data);
  },

  async register(data: LoginInput & { roleId?: number }): Promise<LoginResponse> {
    return api.post<LoginResponse>('/auth/register', data);
  },

  async getProfile(): Promise<User> {
    return api.get<User>('/auth/profile');
  },
};
