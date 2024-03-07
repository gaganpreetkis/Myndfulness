import * as Yup from 'yup'

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);
const getLabelFromResponseField = field => capitalizeFirstLetter(field.replace("_", " "))

const makeSchemaObject = (keys = []) => keys.reduce((previous, current) => Object.assign(previous, { [current]: Yup.string().required().min(1).label(current) }), {})
const getResponseKeys = (formObject = []) => formObject.reduce((previous, current) => previous.concat(current.id), [])

const makeValidationSchema = (formObject) => makeSchemaObject(getResponseKeys(formObject))
const makeResponseObject = (formObject) => getResponseKeys(formObject).reduce((previous, current) => Object.assign({}, previous, { [current]: "" }), {})

export const FormHelper = {
  capitalizeFirstLetter,
  getLabelFromResponseField,
  makeResponseObject
}