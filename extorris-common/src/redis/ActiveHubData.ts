export default interface ActiveHubData {
  id: number;
  portals: Array<{
    id: number;
    x: number;
    y: number;
  }>;
  userIslands: Array<{
    id: number;
    user_id: number;
    x: number;
    y: number;
  }>;
  shipIds: Array<number>;
}
