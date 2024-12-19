import HexagonCoordinates from "@src/interfaces/HexagonCoordinates.js";

export default class HexagonHelper {
  public static getHexData(itemDepth: number, itemNumber: number) {
    const isTopRow = itemNumber >= 0 && itemNumber <= itemDepth;
    const isRightRow = itemNumber > itemDepth && itemNumber < itemDepth * 3;
    const isBottomRow =
      itemNumber >= itemDepth * 3 && itemNumber <= itemDepth * 4;
    const isLeftRow = itemNumber > itemDepth * 4;

    const isIncreasing = itemNumber < itemDepth * 2;
    const isDecreasing = itemNumber > itemDepth * 2;

    const itemCoordinates: HexagonCoordinates = {
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
      isIncreasing,
      isDecreasing,
    };
  }

  public static getDepthItemMaxNumber(depth: number) {
    return depth * 6 || 1;
  }

  public static getHexCoordinatesTopLeft(
    itemDepth: number,
    itemNumber: number,
  ): HexagonCoordinates {
    if (itemDepth === 0) {
      return {
        itemDepth: 1,
        itemNumber: 0,
      };
    }

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

    const itemCoordinates: HexagonCoordinates = {
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

  public static getHexCoordinatesTopRight(
    itemDepth: number,
    itemNumber: number,
  ): HexagonCoordinates {
    if (itemDepth === 0) {
      return {
        itemDepth: 1,
        itemNumber: 1,
      };
    }

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

    const itemCoordinates: HexagonCoordinates = {
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

  public static getHexCoordinatesRight(
    itemDepth: number,
    itemNumber: number,
  ): HexagonCoordinates {
    if (itemDepth === 0) {
      return {
        itemDepth: 1,
        itemNumber: 2,
      };
    }

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

    const itemCoordinates: HexagonCoordinates = {
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

  public static getHexCoordinatesBottomRight(
    itemDepth: number,
    itemNumber: number,
  ): HexagonCoordinates {
    if (itemDepth === 0) {
      return {
        itemDepth: 1,
        itemNumber: 3,
      };
    }

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

    const itemCoordinates: HexagonCoordinates = {
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

  public static getHexCoordinatesBottomLeft(
    itemDepth: number,
    itemNumber: number,
  ): HexagonCoordinates {
    if (itemDepth === 0) {
      return {
        itemDepth: 1,
        itemNumber: 4,
      };
    }

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

    const itemCoordinates: HexagonCoordinates = {
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

  public static getHexCoordinatesLeft(
    itemDepth: number,
    itemNumber: number,
  ): HexagonCoordinates {
    if (itemDepth === 0) {
      return {
        itemDepth: 1,
        itemNumber: 5,
      };
    }

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

    const itemCoordinates: HexagonCoordinates = {
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
}
