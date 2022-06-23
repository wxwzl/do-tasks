# do-tasks

任务池，支持初始化出一个任务池管理器，支持并发执行任务和控制并发的数量，可实时监听每个任务的状态，以及任务池的状态。

## 安装

`npm i do-tasks -S`

## 使用

```
  import { initializePool, TaskPool } from "do-tasks";


  let taskPool: TaskPool = initializePool({ concurrentNumber: 5 });//并发数为5
  cosnt task1 = taskPool.addTask((resolve, reject)=>{
    //task code
    // task success
     resolve();

     //task fail;
     reject();
  });//添加任务等待执行
  task1.once("success",()=>{
    //任务1完成
  });
  task1.once("error",()=>{
    //任务1失败
  })
  task1.once("done",()=>{
    //任务1执行完毕
  })
  taskPool.run();//执行任务

  task1.reRun().then(),catch().finally();//再次自行执行任务1 //不受并发控制，task1.run(),同样的行为

   taskPool.addTask((resolve, reject)=>{
    //task code
    // task success
     resolve();

     //task fail;
     reject();
  },true);// 当任务池空闲时立即执行任务。

  //任务池执行完所有任务，并且没有任何任务处于执行中时触发
  taskPool.on("done", () => {
    done();
  });

```


## 文档

[Documentation generated from source files by Typedoc](./docs/README.md).
