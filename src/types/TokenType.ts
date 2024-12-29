export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export type TokenPayload = {
  userId: string;
  role: string;
  exp?: number;
};
