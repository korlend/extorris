import type RTCalcInstructionsTypes from "@/enums/RTCalcInstructionsTypes";
import type ActiveHubData from "./ActiveHubData";

interface RTCalcInstructionEnlistActiveHub {
  type: RTCalcInstructionsTypes.ENLIST_ACTIVE_HUB;
  data: ActiveHubData;
}

interface RTCalcInstructionAddShipToHub {
  type: RTCalcInstructionsTypes.ADD_SHIP_TO_HUB;
  hubId: number;
  shipId: number;
}

interface RTCalcInstructionRemoveShipFromHub {
  type: RTCalcInstructionsTypes.REMOVE_SHIP_FROM_HUB;
  hubId: number;
  shipId: number;
}

interface RTCalcInstructionChangeShipPosition {
  type: RTCalcInstructionsTypes.CHANGE_SHIP_POSITION;
  shipId: number;
  newPosX: number;
  newPosY: number;
  newAngle: number;
}

interface RTCalcInstructionShutdownRtcalc {
  type: RTCalcInstructionsTypes.SHUTDOWN_RTCALC;
  hubId: number;
}

interface RTCalcInstructionReinitRtcalc {
  type: RTCalcInstructionsTypes.REINIT_RTCALC;
}

interface RTCalcInstructionCheckAlive {
  type: RTCalcInstructionsTypes.CHECK_ALIVE;
}

type RTCalcInstructionData =
  | RTCalcInstructionEnlistActiveHub
  | RTCalcInstructionAddShipToHub
  | RTCalcInstructionRemoveShipFromHub
  | RTCalcInstructionChangeShipPosition
  | RTCalcInstructionShutdownRtcalc
  | RTCalcInstructionReinitRtcalc
  | RTCalcInstructionCheckAlive;

export { type RTCalcInstructionData };
