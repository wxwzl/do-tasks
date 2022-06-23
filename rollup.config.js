import resolve from "rollup-plugin-node-resolve"; //—帮助 Rollup 查找外部模块，然后导入
import commonjs from "@rollup/plugin-commonjs"; // —将CommonJS模块转换为 ES2015 供 Rollup 处理
import json from "@rollup/plugin-json"; // 可以将json文件以es6 模块的方式导入引用
import ts from "@rollup/plugin-typescript"; // 解析ts文件转成js,供 Rollup 处理
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser"; //压缩js代码，包括es6代码压缩,供 Rollup 处理
import alias from "@rollup/plugin-alias"; // 别名的解析
import nodePolyfills from "rollup-plugin-node-polyfills"; //解决第三方依赖引入问题。
import packageJSON from "./package.json";
import path from "path";
import fs from "fs";
const projectRootDir = path.resolve(__dirname);
const getPath = (_path) => path.resolve(__dirname, _path);
const outPutDir = getPath("dist");

function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmdirSync(dir, { recursive: true, force: true });
  }
}
cleanDir(outPutDir);
const customResolver = resolve({
  extensions: [".ts", ".js", ".jsx", ".json", ".less", ".vue"],
});
function getPlungins() {
  return [
    alias({
      entries: [
        { find: "@/", replacement: path.resolve(projectRootDir, "src") },
      ],
      customResolver,
    }),
    resolve({
      browser: true,
    }),
    nodePolyfills(),
    json(),
    ts(),
    commonjs(),
  ];
}
const plugins = getPlungins();
plugins.push(
  terser({
    compress: {
      ecma: 2015,
      pure_getters: true,
    },
  })
);
const libName = "TaskPool";
export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.full.cjs.js",
        format: "cjs",
        exports: "auto",
        sourcemap: true,
        sourcemapFile: "/dist/sourceMap",
      },
      {
        file: "dist/index.full.umd.js",
        format: "umd",
        exports: "auto",
        name: libName,
      },
      { file: "dist/index.full.esm.js", format: "esm", exports: "auto" },
      { file: "dist/index.full.amd.js", format: "amd", exports: "auto" },
      {
        file: "dist/index.full.iife.js",
        format: "iife",
        name: libName,
        exports: "auto",
      }, //一个自动执行的功能，适合作为<script>标签。（如果要为应用程序创建一个捆绑包，您可能想要使用它，因为它会使文件大小变小。）
    ],
    plugins: plugins
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.d.ts",
        format: "esm",
        exports: "auto",
      },
    ],
    plugins: [dts()],
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "umd",
        exports: "auto",
        name: libName,
      },
    ],
    plugins: getPlungins(),
    external:["@wxwzl/eventemitter"]
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJSON.main,
        format: "umd",
        exports: "auto",
        name: libName,
      },
    ],
    plugins:  plugins,
  },
];
