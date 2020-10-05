import {CategoryColor} from "../types/enums/CategoryColor";

export const generateRandomColor = () => {
  const enumValues = Object.keys(CategoryColor)
  const randomIndex = Math.floor(Math.random() * enumValues.length)
  const randomEnumValue = enumValues[randomIndex]
  return randomEnumValue
}