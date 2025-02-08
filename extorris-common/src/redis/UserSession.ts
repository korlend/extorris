export default interface UserSession {
  id: number;
  user_id?: number;
  token: string;
  expire?: Date;
}
