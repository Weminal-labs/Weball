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
  export  interface RoomType {
    bet_amount: string;
    create_time: string;
    creator: string;
    creator_ready: boolean;
    is_player2_joined: boolean;
    is_player2_ready: boolean;
    is_room_close: boolean;
    player2: { vec: Array<string> }; 
    room_id: string;
    room_name: string;
  }
  export type CreateRoomType = {
    bet_amount: string;
    creator: string;
    room_id: string;
    room_name: string;
  };
  