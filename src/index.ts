import EventEmitter from "@wxwzl/eventemitter";
class TaskClass extends EventEmitter {
  execution: ((resolve: (value?: unknown) => void, reject: (e?: Error) => void) => void) | null =
    null;

  promise: Promise<unknown> | null = null;
  constructor(
    execution: (resolve: (value?: unknown) => void, reject: (e?: Error) => void) => void
  ) {
    super();
    this.execution = execution;
  }
  private execute() {
    this.promise = new Promise((resolve, reject) => {
      if (this.execution) {
        this.execution(resolve, reject);
      } else {
        return Promise.resolve();
      }
    })
      .then((res) => {
        this.emit("success", res);
        return Promise.resolve(res);
      })
      .catch((e) => {
        this.emit("error", e);
        return Promise.reject(e);
      })
      .finally(() => {
        this.emit("done");
      });
  }
  run(): Promise<unknown> {
    if (this.promise) {
      return this.promise;
    }
    this.execute();
    return this.promise as unknown as Promise<unknown>;
  }
  reRun() {
    this.execute();
    return this.promise as unknown as Promise<unknown>;
  }
}
export type Task = TaskClass;
export const Status = {
  stoped: "stoped",
  running: "running",
};
export class TaskPool extends EventEmitter {
  list: Array<Task> = [];
  maxSize = -1;
  runNumber = 0;
  state = Status.stoped;
  constructor(concurrentNumber: number) {
    super();
    this.maxSize = concurrentNumber;
  }

  addTask(
    execution: (resolve: (value?: unknown) => void, reject: (e?: Error) => void) => void,
    immediate?: boolean
  ) {
    const task = new TaskClass(execution);
    this.list.push(task);
    if (immediate) {
      this.run();
    }
    return task;
  }

  stop() {
    this.state = Status.stoped;
  }

  clearAllTask() {
    this.list = [];
  }

  run() {
    this.state = Status.running;
    for (let i = this.runNumber; i < this.maxSize; i++) {
      if (this.state === Status.stoped) {
        break;
      }
      const task = this.list.shift();
      if (task) {
        this.runNumber++;
        task.run().finally(() => {
          this.runNumber--;
          this.run();
        });
      } else {
        break;
      }
    }
    if (this.runNumber === 0) {
      this.emit("done");
    }
  }
}

export function initializePool(config: { concurrentNumber: number }) {
  return new TaskPool(config.concurrentNumber);
}
