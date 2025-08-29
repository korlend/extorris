import type HubObjectTypes from "src/enums/HubObjectTypes";
import type Vector2D from "src/models/Vector2D";

export default interface HubObject {
  type: HubObjectTypes;
  collision_coordinates?: Array<Vector2D>;
  // display_figure?: 
}
