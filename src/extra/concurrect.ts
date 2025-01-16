export default async function concurrent(
  cb: () => Promise<void>,
  execTimes = 4,
) {
  const promises = [];

  for (let i = 0; i < execTimes; i++) {
    promises.push(cb);
  }
}
