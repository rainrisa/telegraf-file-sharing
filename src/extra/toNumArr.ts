export default function toNumArr(str?: string) {
  return str?.split(" ").map(Number) || [];
}
