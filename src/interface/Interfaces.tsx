export interface InputList {
  name: string
  value: string
}

export interface IPropsFieldList {
  fields: Array<object>
  inputs: Array<InputList>
  details: Array<object>
  changeInput: Function
}

export interface IPropsFetchField {
  fields: Array<object>
  options: Array<object>
  changeField: Function
}
