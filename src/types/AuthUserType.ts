export type AuthUserType = {
  payload: unknown;
  id: string;
  accessToken: string;
  refreshToken: string;
  status: string;
  role: string;
  iat: number;
  exp: number;
};
