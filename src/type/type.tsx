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
export interface RoomType {
  bet_amount: string;
  create_time: string;
  creator: string;
  username :string;
  creator_ready: boolean;
  invited_friend_username: { vec: string[] }; // Assuming `vec` is an array of strings
  is_creator_joined: boolean;
  is_player2_joined: boolean;
  is_player2_ready: boolean;
  is_room_close: boolean;
  player2: { vec: any[] }; // Assuming `vec` is an array of strings
  room_id: string;
  room_name: string;
  winner: { vec: any[] }; // Assuming `vec` is an array of strings
}

export type CreateRoomType = {
  bet_amount: string;
  creator: string;
  room_id: string;
  room_name: string;
};
export type PlayerInfo = {
  dislikes_received: string;
  games_played: string;
  likes_received: string;
  name: string;
  points: string;
  pool: string;
  user_image: string;
  username: string;
  winning_games: string;
};
interface PlayerInfoLeader {
  username: string;
  name: string;
  points: number;
  games_played: number;
  winning_games: number;
  likes_received: number;
  dislikes_received: number;
  user_image: string;
}