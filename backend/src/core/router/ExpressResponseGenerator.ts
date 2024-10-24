import ExpressAPIType from "@src/enums/ExpressAPIType.js";
import ExpressResponseCodes from "@src/enums/ExpressResponseCodes.js";
import ExpressResponseTypes from "@src/enums/ExpressResponseTypes.js";
import DBModel from "@src/models/db/DBModel.js";
import ExpressNext from "@src/models/ExpressNext.js";

export default class ExpressResponseGenerator {
  public static getResponse<T>(
    status: ExpressResponseTypes,
    responseData?: any | T | Array<T>,
    text?: string,
    apiType?: ExpressAPIType,
  ): ExpressNext {
    let preparedData: any = responseData;

    if (responseData instanceof DBModel) {
      preparedData = responseData.prepareREST();
    }

    if (
      responseData instanceof Array &&
      responseData.length > 0 &&
      responseData[0] instanceof DBModel
    ) {
      preparedData = [];
      for (let i = 0; i < responseData.length; i++) {
        preparedData.push(responseData[i].prepareREST());
      }
    }

    return new ExpressNext(
      ExpressResponseCodes[status],
      preparedData,
      text,
      apiType,
    );
  }
}
