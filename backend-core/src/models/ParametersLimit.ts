
export default class ParametersLimit {
  exclude: Array<string>
  only: Array<string>
  excludeReturn: Array<string>
  ignoreValues: Array<any>

  constructor (exclude: Array<string> = [], only: Array<string> = [], excludeReturn: Array<string> = [], ignoreValues: Array<string> = []) {
    this.exclude = exclude
    this.only = only
    this.excludeReturn = excludeReturn
    this.ignoreValues = ignoreValues
  }
}
