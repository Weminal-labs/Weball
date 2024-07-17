export interface User {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    exp: number;
    family_name: string;
    given_name: string;
    iat: number;
    jti: string;
    name: string;
    nbf: number;
    nonce: string;
    picture: string;
  }