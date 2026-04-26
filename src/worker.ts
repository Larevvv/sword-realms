console.log("SERVICE WORKER");
self.addEventListener("fetch", (event) => {
    console.log({ event });
});
