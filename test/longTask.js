const params = process.argv;
let now = new Date().getTime();
let t = 0;
while (t < 1 * 5 * 1000) {
  t = new Date().getTime() - now;
}
console.log(`${params[2]}已完成`);
