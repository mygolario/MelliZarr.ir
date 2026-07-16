import { customAlphabet } from "nanoid";

const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const nanoid = customAlphabet(alphabet, 8);

export function createPublicOrderCode(): string {
  return `MZ-${nanoid()}`;
}
