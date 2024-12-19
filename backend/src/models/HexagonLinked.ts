import HexagonCoordinates from "@src/interfaces/HexagonCoordinates.js";
import { MainMapHubModel } from "./db/index.js";

export default class HexagonLinked {
  topLeft?: HexagonCoordinates;
  topRight?: HexagonCoordinates;
  right?: HexagonCoordinates;
  bottomRight?: HexagonCoordinates;
  bottomLeft?: HexagonCoordinates;
  left?: HexagonCoordinates;

  isTopLeftBlocked: boolean = false;
  isTopRightBlocked: boolean = false;
  isRightBlocked: boolean = false;
  isBottomRightBlocked: boolean = false;
  isBottomLeftBlocked: boolean = false;
  isLeftBlocked: boolean = false;

  treeMap: Record<string, HexagonLinked>;

  mainMapHub: MainMapHubModel;

  constructor(
    mainMapHub: MainMapHubModel,
    topLeft: HexagonCoordinates,
    topRight: HexagonCoordinates,
    right: HexagonCoordinates,
    bottomRight: HexagonCoordinates,
    bottomLeft: HexagonCoordinates,
    left: HexagonCoordinates,
    treeMap?: Record<string, HexagonLinked>,
  ) {
    this.mainMapHub = mainMapHub;
    this.topLeft = topLeft;
    this.topRight = topRight;
    this.right = right;
    this.bottomRight = bottomRight;
    this.bottomLeft = bottomLeft;
    this.left = left;
    if (!treeMap) {
      this.treeMap = {};
    } else {
      this.treeMap = treeMap;
    }
  }
}
