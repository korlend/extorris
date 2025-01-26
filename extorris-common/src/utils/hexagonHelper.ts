import type HexCoordinates from "src/interfaces/HexCoordinates";

// type HexDirection =
//   | "topLeft"
//   | "topRight"
//   | "right"
//   | "bottomRight"
//   | "bottomLeft"
//   | "left";

export enum HexDirection {
  TOP_LEFT = "topLeft",
  TOP_RIGHT = "topRight",
  RIGHT = "right",
  BOTTOM_RIGHT = "bottomRight",
  BOTTOM_LEFT = "bottomLeft",
  LEFT = "left",
}

export function getDepthItemMaxNumber(depth: number) {
  return depth * 6 || 1;
}

export function getHexNearbyCoords(
  itemDepth: number,
  itemNumber: number
): Record<HexDirection, HexCoordinates> {
  return {
    topLeft: getHexCoordinatesTopLeft(itemDepth, itemNumber),
    topRight: getHexCoordinatesTopRight(itemDepth, itemNumber),
    right: getHexCoordinatesRight(itemDepth, itemNumber),
    bottomRight: getHexCoordinatesBottomRight(itemDepth, itemNumber),
    bottomLeft: getHexCoordinatesBottomLeft(itemDepth, itemNumber),
    left: getHexCoordinatesLeft(itemDepth, itemNumber),
  };
}


export function getHexesDirection(
  fromDepth: number,
  fromNumber: number,
  toDepth: number,
  toNumber: number,
): HexDirection | null {
  const coords = getHexNearbyCoords(fromDepth, fromNumber);

  const keys = Object.values(HexDirection) as Array<HexDirection>;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (
      toDepth === coords[key].itemDepth &&
      toNumber === coords[key].itemNumber
    ) {
      return key;
    }
  }

  return null;
}

export function getReverseDirection(direction: HexDirection): HexDirection {
  if (direction === HexDirection.TOP_LEFT) {
    return HexDirection.BOTTOM_RIGHT;
  }
  if (direction === HexDirection.TOP_RIGHT) {
    return HexDirection.BOTTOM_LEFT;
  }
  if (direction === HexDirection.RIGHT) {
    return HexDirection.LEFT;
  }
  if (direction === HexDirection.BOTTOM_RIGHT) {
    return HexDirection.TOP_LEFT;
  }
  if (direction === HexDirection.BOTTOM_LEFT) {
    return HexDirection.TOP_RIGHT;
  }
  return HexDirection.RIGHT;
}

export function getHexData(itemDepth: number, itemNumber: number) {
  const isTopRow = itemNumber >= 0 && itemNumber <= itemDepth;
  const isRightRow = itemNumber > itemDepth && itemNumber < itemDepth * 3;
  const isBottomRow =
    itemNumber >= itemDepth * 3 && itemNumber <= itemDepth * 4;
  const isLeftRow = itemNumber > itemDepth * 4;

  const isRightRowIncreasing = itemNumber < itemDepth * 2;
  const isRightRowDecreasing = itemNumber > itemDepth * 2;
  const isLeftRowIncreasing = itemNumber < itemDepth * 5;
  const isLeftRowDecreasing = itemNumber > itemDepth * 5;
  const isRightRowMiddle = itemNumber === itemDepth * 2;
  const isLeftRowMiddle = itemNumber === itemDepth * 5;

  const itemCoordinates: HexCoordinates = {
    itemDepth: 0,
    itemNumber: 0,
  };

  if (isTopRow) {
    itemCoordinates.itemDepth = itemDepth + 1;
    itemCoordinates.itemNumber = itemNumber;
  }

  return {
    isTopRow,
    isRightRow,
    isBottomRow,
    isLeftRow,
    isRightRowMiddle,
    isLeftRowMiddle,
    isRightRowIncreasing,
    isRightRowDecreasing,
    isLeftRowIncreasing,
    isLeftRowDecreasing,
  };
}

export function getHexCoordinatesTopLeft(
  itemDepth: number,
  itemNumber: number
): HexCoordinates {
  if (itemDepth === 0) {
    return {
      itemDepth: 1,
      itemNumber: 0,
    };
  }

  const {
    isTopRow,
    isRightRow,
    isBottomRow,
    isLeftRow,
    isRightRowMiddle,
    isLeftRowMiddle,
    isRightRowIncreasing,
    isRightRowDecreasing,
    isLeftRowIncreasing,
    isLeftRowDecreasing,
  } = getHexData(itemDepth, itemNumber);

  const itemCoordinates: HexCoordinates = {
    itemDepth: 1,
    itemNumber: 0,
  };

  if (isTopRow) {
    itemCoordinates.itemDepth = itemDepth + 1;
    itemCoordinates.itemNumber = itemNumber;
  } else if (isBottomRow) {
    if (itemNumber === itemDepth * 4) {
      itemCoordinates.itemDepth = itemDepth;
      itemCoordinates.itemNumber = itemNumber + 1;
    } else {
      itemCoordinates.itemDepth = itemDepth - 1;
      itemCoordinates.itemNumber = itemNumber - 3;
    }
  } else if (isRightRow) {
    if (isRightRowIncreasing || isRightRowMiddle) {
      itemCoordinates.itemDepth = itemDepth;
      itemCoordinates.itemNumber = itemNumber - 1;
    } else if (isRightRowDecreasing) {
      itemCoordinates.itemDepth = itemDepth - 1;
      itemCoordinates.itemNumber = itemNumber - 3;
    }
  } else if (isLeftRow) {
    if (isLeftRowIncreasing) {
      itemCoordinates.itemDepth = itemDepth;
      itemCoordinates.itemNumber = itemNumber + 1;
    } else if (isLeftRowDecreasing || isLeftRowMiddle) {
      itemCoordinates.itemDepth = itemDepth + 1;
      itemCoordinates.itemNumber = itemNumber + 6;
    }
  }

  return itemCoordinates;
}

export function getHexCoordinatesTopRight(
  itemDepth: number,
  itemNumber: number
): HexCoordinates {
  if (itemDepth === 0) {
    return {
      itemDepth: 1,
      itemNumber: 1,
    };
  }

  const {
    isTopRow,
    isRightRow,
    isBottomRow,
    isLeftRow,
    isRightRowMiddle,
    isLeftRowMiddle,
    isRightRowIncreasing,
    isRightRowDecreasing,
    isLeftRowIncreasing,
    isLeftRowDecreasing,
  } = getHexData(itemDepth, itemNumber);

  const itemCoordinates: HexCoordinates = {
    itemDepth: 0,
    itemNumber: 0,
  };

  if (isTopRow) {
    itemCoordinates.itemDepth = itemDepth + 1;
    itemCoordinates.itemNumber = itemNumber + 1;
  } else if (isBottomRow) {
    if (itemNumber === itemDepth * 3) {
      itemCoordinates.itemDepth = itemDepth;
      itemCoordinates.itemNumber = itemNumber - 1;
    } else {
      itemCoordinates.itemDepth = itemDepth - 1;
      itemCoordinates.itemNumber = itemNumber - 4;
    }
  } else if (isRightRow) {
    if (isRightRowIncreasing || isRightRowMiddle) {
      itemCoordinates.itemDepth = itemDepth + 1;
      itemCoordinates.itemNumber = itemNumber + 1;
    } else if (isRightRowDecreasing) {
      itemCoordinates.itemDepth = itemDepth;
      itemCoordinates.itemNumber = itemNumber - 1;
    }
  } else if (isLeftRow) {
    if (itemDepth * 6 - 1 === itemNumber) {
      itemCoordinates.itemDepth = itemDepth;
      itemCoordinates.itemNumber = itemNumber = 0;
    } else if (isLeftRowIncreasing) {
      itemCoordinates.itemDepth = itemDepth - 1;
      itemCoordinates.itemNumber = itemNumber - 4;
    } else if (isLeftRowDecreasing || isLeftRowMiddle) {
      itemCoordinates.itemDepth = itemDepth;
      itemCoordinates.itemNumber = itemNumber + 1;
    }
  }

  return itemCoordinates;
}

export function getHexCoordinatesRight(
  itemDepth: number,
  itemNumber: number
): HexCoordinates {
  if (itemDepth === 0) {
    return {
      itemDepth: 1,
      itemNumber: 2,
    };
  }

  const {
    isTopRow,
    isRightRow,
    isBottomRow,
    isLeftRow,
    isRightRowMiddle,
    isLeftRowMiddle,
    isRightRowIncreasing,
    isRightRowDecreasing,
    isLeftRowIncreasing,
    isLeftRowDecreasing,
  } = getHexData(itemDepth, itemNumber);

  const itemCoordinates: HexCoordinates = {
    itemDepth: 0,
    itemNumber: 0,
  };

  if (isTopRow) {
    if (itemNumber === itemDepth) {
      itemCoordinates.itemDepth = itemDepth + 1;
      itemCoordinates.itemNumber = itemNumber + 2;
    } else {
      itemCoordinates.itemDepth = itemDepth;
      itemCoordinates.itemNumber = itemNumber + 1;
    }
  } else if (isBottomRow) {
    if (itemNumber === itemDepth * 3) {
      itemCoordinates.itemDepth = itemDepth + 1;
      itemCoordinates.itemNumber = itemNumber + 2;
    } else {
      itemCoordinates.itemDepth = itemDepth;
      itemCoordinates.itemNumber = itemNumber - 1;
    }
  } else if (isRightRow) {
    itemCoordinates.itemDepth = itemDepth + 1;
    itemCoordinates.itemNumber = itemNumber + 2;
  } else if (isLeftRow) {
    if (itemDepth * 6 - 1 === itemNumber) {
      itemCoordinates.itemDepth = itemDepth - 1;
      itemCoordinates.itemNumber = 0;
    } else {
      itemCoordinates.itemDepth = itemDepth - 1;
      itemCoordinates.itemNumber = itemNumber - 5;
    }
  }

  return itemCoordinates;
}

export function getHexCoordinatesBottomRight(
  itemDepth: number,
  itemNumber: number
): HexCoordinates {
  if (itemDepth === 0) {
    return {
      itemDepth: 1,
      itemNumber: 3,
    };
  }

  const {
    isTopRow,
    isRightRow,
    isBottomRow,
    isLeftRow,
    isRightRowMiddle,
    isLeftRowMiddle,
    isRightRowIncreasing,
    isRightRowDecreasing,
    isLeftRowIncreasing,
    isLeftRowDecreasing,
  } = getHexData(itemDepth, itemNumber);

  const itemCoordinates: HexCoordinates = {
    itemDepth: 0,
    itemNumber: 0,
  };

  if (isTopRow) {
    if (itemNumber === itemDepth) {
      itemCoordinates.itemDepth = itemDepth;
      itemCoordinates.itemNumber = itemNumber + 1;
    } else {
      itemCoordinates.itemDepth = itemDepth - 1;
      itemCoordinates.itemNumber = itemNumber;
    }
  } else if (isBottomRow) {
    itemCoordinates.itemDepth = itemDepth + 1;
    itemCoordinates.itemNumber = itemNumber + 3;
  } else if (isRightRow) {
    if (isRightRowIncreasing) {
      itemCoordinates.itemDepth = itemDepth;
      itemCoordinates.itemNumber = itemNumber + 1;
    } else if (isRightRowDecreasing || isRightRowMiddle) {
      itemCoordinates.itemDepth = itemDepth + 1;
      itemCoordinates.itemNumber = itemNumber + 3;
    }
  } else if (isLeftRow) {
    if (isLeftRowIncreasing || isLeftRowMiddle) {
      itemCoordinates.itemDepth = itemDepth;
      itemCoordinates.itemNumber = itemNumber - 1;
    } else if (isLeftRowDecreasing) {
      itemCoordinates.itemDepth = itemDepth - 1;
      itemCoordinates.itemNumber = itemNumber - 6;
    }
  }

  return itemCoordinates;
}

export function getHexCoordinatesBottomLeft(
  itemDepth: number,
  itemNumber: number
): HexCoordinates {
  if (itemDepth === 0) {
    return {
      itemDepth: 1,
      itemNumber: 4,
    };
  }

  const {
    isTopRow,
    isRightRow,
    isBottomRow,
    isLeftRow,
    isRightRowMiddle,
    isLeftRowMiddle,
    isRightRowIncreasing,
    isRightRowDecreasing,
    isLeftRowIncreasing,
    isLeftRowDecreasing,
  } = getHexData(itemDepth, itemNumber);

  const itemCoordinates: HexCoordinates = {
    itemDepth: 0,
    itemNumber: 0,
  };

  if (isTopRow) {
    if (itemNumber === 0) {
      itemCoordinates.itemDepth = itemDepth;
      itemCoordinates.itemNumber = itemDepth * 6 - 1;
    } else {
      itemCoordinates.itemDepth = itemDepth - 1;
      itemCoordinates.itemNumber = itemNumber - 1;
    }
  } else if (isBottomRow) {
    itemCoordinates.itemDepth = itemDepth + 1;
    itemCoordinates.itemNumber = itemNumber + 4;
  } else if (isRightRow) {
    if (isRightRowIncreasing) {
      itemCoordinates.itemDepth = itemDepth - 1;
      itemCoordinates.itemNumber = itemNumber - 1;
    } else if (isRightRowDecreasing || isRightRowMiddle) {
      itemCoordinates.itemDepth = itemDepth;
      itemCoordinates.itemNumber = itemNumber + 1;
    }
  } else if (isLeftRow) {
    if (isLeftRowIncreasing || isLeftRowMiddle) {
      itemCoordinates.itemDepth = itemDepth + 1;
      itemCoordinates.itemNumber = itemNumber + 4;
    } else if (isLeftRowDecreasing) {
      itemCoordinates.itemDepth = itemDepth;
      itemCoordinates.itemNumber = itemNumber - 1;
    }
  }

  return itemCoordinates;
}

export function getHexCoordinatesLeft(
  itemDepth: number,
  itemNumber: number
): HexCoordinates {
  if (itemDepth === 0) {
    return {
      itemDepth: 1,
      itemNumber: 5,
    };
  }

  const {
    isTopRow,
    isRightRow,
    isBottomRow,
    isLeftRow,
    isRightRowMiddle,
    isLeftRowMiddle,
    isRightRowIncreasing,
    isRightRowDecreasing,
    isLeftRowIncreasing,
    isLeftRowDecreasing,
  } = getHexData(itemDepth, itemNumber);

  const itemCoordinates: HexCoordinates = {
    itemDepth: 0,
    itemNumber: 0,
  };

  if (isTopRow) {
    if (itemNumber === 0) {
      itemCoordinates.itemDepth = itemDepth + 1;
      itemCoordinates.itemNumber = (itemDepth + 1) * 6 - 1;
    } else {
      itemCoordinates.itemDepth = itemDepth;
      itemCoordinates.itemNumber = itemNumber - 1;
    }
  } else if (isBottomRow) {
    if (itemNumber === itemDepth * 4) {
      itemCoordinates.itemDepth = itemDepth + 1;
      itemCoordinates.itemNumber = itemNumber + 5;
    } else {
      itemCoordinates.itemDepth = itemDepth;
      itemCoordinates.itemNumber = itemNumber + 1;
    }
  } else if (isRightRow) {
    itemCoordinates.itemDepth = itemDepth - 1;
    itemCoordinates.itemNumber = itemNumber - 2;
  } else if (isLeftRow) {
    itemCoordinates.itemDepth = itemDepth + 1;
    itemCoordinates.itemNumber = itemNumber + 5;
  }

  return itemCoordinates;
}
