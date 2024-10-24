import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import ExpressResponseCodes from "@src/enums/ExpressResponseCodes.js";

export default class PropagatedError extends Error {
  responseType: ExpressResponseTypes;
  responseCode: number;

  constructor(responseType?: ExpressResponseTypes, text?: string) {
    super(text);
    this.responseType = responseType || ExpressResponseTypes.ERROR;
    this.responseCode = ExpressResponseCodes[this.responseType];
  }
}
