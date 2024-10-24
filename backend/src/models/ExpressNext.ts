import ExpressAPIType from "@src/enums/ExpressAPIType.js";

export default class ExpressNext {
  statusCode: number = 500;
  responseObject: any;
  text?: string;
  apiType?: ExpressAPIType;

  constructor(
    statusCode: number,
    responseObject: any,
    text?: string,
    apiType?: ExpressAPIType,
  ) {
    this.statusCode = statusCode;
    this.responseObject = responseObject;
    this.text = text;
    this.apiType = apiType;
  }
}
