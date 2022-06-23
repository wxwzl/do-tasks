/**
 * @jest-environment jsdom
 */
import { initializePool, TaskPool } from "../src/index";
import childProcess from "child_process";
const path = require("path");
const dir = __dirname;
test("taskPool", (done) => {
  let taskPool: TaskPool = initializePool({ concurrentNumber: 5 });
  for (let i = 0; i < 10; i++) {
    taskPool.addTask((resolve, reject) => {
      childProcess.fork(path.join(dir, "./longTask.js")).on("close", (code) => {
        console.log(`child process ${i} ${code}`);
        resolve(undefined);
      });
    });
  }
  taskPool.run();
  for (let i = 0; i < 10; i++) {
    taskPool.addTask((resolve, reject) => {
      childProcess.fork(path.join(dir, "./longTask.js")).on("close", (code) => {
        console.log(`child process---- ${i} ${code}`);
        resolve(undefined);
      });
    }, true);
  }
  taskPool.on("done", () => {
    done();
  });
});
