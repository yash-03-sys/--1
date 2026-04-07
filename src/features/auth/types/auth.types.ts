export interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
