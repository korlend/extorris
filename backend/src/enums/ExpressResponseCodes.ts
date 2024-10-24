import ExpressResponseTypes from "./ExpressResponseTypes.js";

const ExpressResponseCodes: Record<ExpressResponseTypes, number> = {
  [ExpressResponseTypes.SUCCESS]: 200,
  [ExpressResponseTypes.ERROR]: 500,
  [ExpressResponseTypes.FORBIDDEN]: 403,
  [ExpressResponseTypes.SESSION_EXPIRED]: 440,
  [ExpressResponseTypes.UNAUTHORIZED]: 401,
  [ExpressResponseTypes.NO_CONTENT]: 204,
};

export default ExpressResponseCodes;
