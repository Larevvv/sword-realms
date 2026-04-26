var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/worker.ts
var require_worker = __commonJS({
  "src/worker.ts"() {
    console.log("SERVICE WORKER");
    self.addEventListener("fetch", (event) => {
      console.log({ event });
    });
  }
});
export default require_worker();
