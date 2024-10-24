import DBModel from "@src/models/db/DBModel.js";
import ParametersLimit from "@src/models/ParametersLimit.js";

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
  public static buildCreateData<T extends DBModel<T>>(
    data: Array<T>,
    fields: ParametersLimit,
  ): BuiltCreateData;
  public static buildCreateData<T extends DBModel<T>>(
    data: T,
    fields: ParametersLimit,
  ): BuiltCreateData;
  public static buildCreateData<T extends DBModel<T>>(
    data: T | Array<T>,
    fields: ParametersLimit = new ParametersLimit(),
  ): BuiltCreateData {
    //single data model
    if (data instanceof DBModel) {
      const dataMap = data.getParamsAndValues(fields);
      const immutables = data._immutables;

      const names: Array<string> = [];
      const values: Array<any> = [];

      dataMap.forEach((value: any, key: string) => {
        if (value === undefined || immutables.some((name) => key === name)) {
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

    // multiple data models
    // INSERT INTO {target} ({queryParameters})
    // VALUES (),()... --> {queryValues}
    if (data instanceof Array && data.length) {
      const firstModel = data[0];

      const firstDataMap = firstModel.getParamsAndValues(fields);
      const firstImmutables = firstModel._immutables;

      const names: Array<string> = [];

      firstDataMap.forEach((value: any, key: string) => {
        if (firstImmutables.some((name) => key === name)) {
          return;
        }

        names.push(key);
      });

      const queryParameters = names.join(",");
      const queryValuesArray: Array<string> = [];
      const values: Array<any> = [];

      for (let i = 0; i < data.length; i++) {
        const model = data[i];
        const dataMap = model.getParamsAndValues(fields);
        const immutables = model._immutables;

        const values: Array<any> = [];

        for (let j = 0; j < names.length; j++) {
          const name = names[i];
          if (immutables.some((immutableName) => name === immutableName)) {
            continue;
          }
          const value = dataMap.get(name);
          values.push(value);
        }

        queryValuesArray.push(`(${names.map(() => "?").join(",")})`);
      }
      return {
        values,
        queryParameters,
        queryValues: queryValuesArray.join(","),
      };
    }

    return {
      values: [],
      queryParameters: "",
      queryValues: "",
    };
  }

  public static buildUpdateData<T extends DBModel<T>>(
    data: T,
    fields: ParametersLimit = new ParametersLimit(),
  ): BuiltUpdateData {
    //single data model
    //UPDATE table_name
    // SET column1 = value1, column2 = value2, ... --> {queryParametersAndValues}
    // WHERE condition;
    const dataMap = data.getParamsAndValues(fields);
    const immutables = data._immutables;

    const names: Array<string> = [];
    const values: Array<any> = [];

    dataMap.forEach((value: any, key: string) => {
      if (value === undefined || immutables.some((name) => key === name)) {
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
    fields: ParametersLimit = new ParametersLimit(),
  ): BuiltUpdateData {
    // UPDATE savage_grove.admins adm
    // join (
    //   SELECT 1 as id, '11' as new_username, '111' as new_email
    //     UNION ALL
    //     SELECT 3, '22', '222'
    // ) vals on adm.id = vals.id
    // set username = new_username, email = new_email
    const firstModel = data[0];

    const firstDataMap = firstModel.getParamsAndValues(fields);
    const firstImmutables = firstModel._immutables;

    const names: Array<string> = [];

    const firstRowQueries: Array<string> = [];
    const endSetRowQueries: Array<string> = [];

    firstDataMap.forEach((value: any, key: string) => {
      if (firstImmutables.some((name) => key === name)) {
        return;
      }

      names.push(key);
      firstRowQueries.push(`? as new_${key}`);
      endSetRowQueries.push(`${key} = new_${key}`);
    });

    const queryArray: Array<string> = [
      `SELECT ${firstDataMap.get("id")} as id, ${firstRowQueries.join(",")}`,
    ];

    const values: Array<any> = [];

    for (let i = 0; i < data.length; i++) {
      const model = data[i];
      const dataMap = model.getParamsAndValues(fields);
      const immutables = model._immutables;

      // we ignore immutables (which always has id), so put it manually
      values.push(dataMap.get("id"));

      for (let j = 0; j < names.length; j++) {
        const name = names[i];
        if (immutables.some((immutableName) => name === immutableName)) {
          continue;
        }
        const value = dataMap.get(name);
        values.push(value);
      }

      queryArray.push(`SELECT ${names.map(() => "?").join(",")}`);
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
// INSERT INTO ${this.target} (${model.parametersKeysSnake(fields).join(",")})
// VALUES (${model
//   .parametersKeys(fields)
//   .filter((v) => !fields.only.length || fields.only.includes(v))
//   .map(() => "?")
//   .join(",")})
// `,
//   [...model.parametersValues(fields)],
// )
