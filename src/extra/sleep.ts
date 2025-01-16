export default async function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
