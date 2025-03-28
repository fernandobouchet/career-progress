import { statusEnum } from "./enums";

export const statusKeys = Object.keys(statusEnum) as [
  keyof typeof statusEnum,
  ...Array<keyof typeof statusEnum>
];
