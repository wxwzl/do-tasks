/**
 * @jest-environment jsdom
 */
import { initializePool, TaskPool } from "../src/index";
import childProcess from "child_process";
import path from "path";
const dir = __dirname;
jest.setTimeout(500000);
function formatTime(time: number) {
  return time / 1000 + "秒";
}
test("taskPool", (done) => {
  const taskPool: TaskPool = initializePool({ concurrentNumber: 3 });
  const startTime = new Date().getTime();
  for (let i = 0; i < 10; i++) {
    taskPool.addTask((resolve, reject) => {
      childProcess.fork(path.join(dir, "./longTask.js"), [`任务A${i}`]).on("close", (code) => {
        if (code === 0) {
          console.log(`任务A${i} 完成`, formatTime(new Date().getTime() - startTime));
          resolve(undefined);
        } else {
          reject(new Error(code + ""));
        }
      });
    });
  }
  taskPool.run();
  for (let i = 0; i < 10; i++) {
    taskPool.addTask((resolve, reject) => {
      childProcess.fork(path.join(dir, "./longTask.js"), [`任务B${i}`]).on("close", (code) => {
        if (code === 0) {
          console.log(`任务B${i} 完成`, formatTime(new Date().getTime() - startTime));
          resolve(undefined);
        } else {
          reject(new Error(code + ""));
        }
      });
    }, true);
  }
  taskPool.on("done", () => {
    done();
  });
});
