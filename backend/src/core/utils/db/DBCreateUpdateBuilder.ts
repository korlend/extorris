import DBModel from "@src/models/db/DBModel.js";
import ParametersLimit from "@src/models/ParametersLimit.js";
import { DBModelDBDataKeys } from "@src/types/DBModelDBDataKeys.js";

type BuiltCreateData = {
  values: Array<any>;
  queryParameters: string;
  queryValues: string;
};

type BuiltUpdateData = {
  values: Array<any>;
  queryParametersAndValues: string;
};

export default class DBCreateUpdateBuilder {
  public static buildArrayCreateData<T extends DBModel<T>>(
    data: Array<T>,
    fields: ParametersLimit<T>,
  ): BuiltCreateData {
    // multiple data models
    // INSERT INTO {target} ({queryParameters})
    // VALUES (),()... --> {queryValues}
    if (!(data instanceof Array) || !data.length) {
      return {
        values: [],
        queryParameters: "",
        queryValues: "",
      };
    }
    const firstModel = data[0];

    const firstDataMap = firstModel.getParamsAndValues(fields);

    const names: Array<DBModelDBDataKeys<T>> = [];

    firstDataMap.forEach((value, key) => {
      if (value === undefined || firstModel.isImmutable(key)) {
        return;
      }

      names.push(key);
    });

    const queryParameters = names.join(",");
    const queryValuesArray: Array<string> = [];
    const values: Array<T[DBModelDBDataKeys<T>] | null> = [];

    for (let i = 0; i < data.length; i++) {
      const model = data[i];
      const dataMap = model.getParamsAndValues(fields);

      for (let j = 0; j < names.length; j++) {
        const name = names[j];
        const value = dataMap.get(name);
        values.push(value === undefined ? null : value);
      }

      queryValuesArray.push(`(${names.map(() => "?").join(",")})`);
    }
    return {
      values,
      queryParameters,
      queryValues: queryValuesArray.join(","),
    };
  }

  public static buildCreateData<T extends DBModel<T>>(
    data: T,
    fields: ParametersLimit<T>,
  ): BuiltCreateData {
    //single data model
    if (!data) {
      return {
        values: [],
        queryParameters: "",
        queryValues: "",
      };
    }

    const dataMap = data.getParamsAndValues(fields);

    const names: Array<DBModelDBDataKeys<T>> = [];
    const values: Array<T[DBModelDBDataKeys<T>]> = [];

    dataMap.forEach((value, key) => {
      if (value === undefined || data.isImmutable(key)) {
        return;
      }

      names.push(key);
      values.push(value);
    });

    const queryParameters = names.join(",");
    const queryValues = names.map(() => "?").join(",");

    return {
      values,
      queryParameters,
      queryValues,
    };
  }

  public static buildUpdateData<T extends DBModel<T>>(
    data: T,
    fields: ParametersLimit<T> = new ParametersLimit(),
  ): BuiltUpdateData {
    //single data model
    //UPDATE table_name
    // SET column1 = value1, column2 = value2, ... --> {queryParametersAndValues}
    // WHERE condition;
    const dataMap = data.getParamsAndValues(fields);

    const names: Array<DBModelDBDataKeys<T> | string> = [];
    const values: Array<T[DBModelDBDataKeys<T>]> = [];

    dataMap.forEach((value, key) => {
      if (value === undefined || data.isImmutable(key)) {
        return;
      }

      names.push(`${key} = ?`);
      values.push(value);
    });

    const queryParametersAndValues = names.join(",");

    return {
      values,
      queryParametersAndValues,
    };
  }

  public static buildUpdateMultipleData<T extends DBModel<T>>(
    data: Array<T>,
    tableAlias: String,
    fields: ParametersLimit<T> = new ParametersLimit(),
  ): BuiltUpdateData {
    // built example
    // UPDATE savage_grove.admins adm
    // join (
    //   SELECT 1 as id, '11' as new_username, '111' as new_email
    //     UNION ALL
    //     SELECT 3, '22', '222'
    //     UNION ALL
    //     SELECT 4, '44', '444'
    // ) vals on adm.id = vals.id
    // set username = new_username, email = new_email
    const fieldsId = "id" as DBModelDBDataKeys<T>;
    if (fields.include?.length && !fields.include.includes(fieldsId)) {
      fields.include.push(fieldsId);
    }
    const firstModel = data[0];

    const firstDataMap = firstModel.getParamsAndValues(fields);

    const names: Array<DBModelDBDataKeys<T>> = [];

    const firstRowQueries: Array<string> = [];
    const endSetRowQueries: Array<string> = [];
    const firstRowValues: Array<any> = [];

    firstDataMap.forEach((value, key) => {
      if (firstModel.isImmutable(key)) {
        return;
      }

      names.push(key);
      firstRowValues.push(value);
      firstRowQueries.push(`? as new_${key}`);
      endSetRowQueries.push(`${key} = new_${key}`);
    });

    const queryArray: Array<string> = [
      `SELECT ${firstDataMap.get("id" as DBModelDBDataKeys<T>)} as id, ${firstRowQueries.join(",")}`,
    ];

    const values: Array<any> = [...firstRowValues];

    for (let i = 1; i < data.length; i++) {
      const model = data[i];
      const dataMap = model.getParamsAndValues(fields);

      for (let j = 0; j < names.length; j++) {
        const name = names[i];
        if (model.isImmutable(name)) {
          continue;
        }
        const value = dataMap.get(name);
        values.push(value);
      }

      queryArray.push(
        `SELECT ${dataMap.get("id" as DBModelDBDataKeys<T>)},${names.map(() => "?").join(",")}`,
      );
    }

    let queryParametersAndValues: string = `
      join (
        ${queryArray.join(`
          UNION ALL
        `)}
      ) vals on ${tableAlias}.id = vals.id
    `;

    queryParametersAndValues = `
      ${queryParametersAndValues}
      set ${endSetRowQueries.join(",")}
    `;

    return {
      values,
      queryParametersAndValues,
    };
  }
}

// .query(
//   `
// INSERT INTO ${this.target} (${model.parametersKeys(fields).join(",")})
// VALUES (${model
//   .parametersKeys(fields)
//   .filter((v) => !fields.include.length || fields.include.includes(v))
//   .map(() => "?")
//   .join(",")})
// `,
//   [...model.parametersValues(fields)],
// )
