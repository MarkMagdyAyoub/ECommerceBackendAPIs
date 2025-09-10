export interface DecodedToken {
  id: string;
  username: string;
  email: string;
  city : string,
  street : string;
  role: string;
  iat: number;
  exp: number;
}