export default interface ShipPosition {
  id: number;
  user_id: number;
  x: number;
  y: number;
  speed: number;
  angle: number;
  hp: number;
  lastUpdate: number; // new Date(lastUpdate)
}