import { StatusEnum } from "./enums";

export const statusKeys = Object.keys(StatusEnum) as [
  keyof typeof StatusEnum,
  ...Array<keyof typeof StatusEnum>
];
