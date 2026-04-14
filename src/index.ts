import DOMPurify from "dompurify";

const loadURLContent = () => {
    const targetPath = location.pathname.slice(1);
    console.log({ targetPath });
    myWorker.postMessage(targetPath);
};

const myWorker = new Worker("/public/js/worker.js");

myWorker.onmessage = (e) => {
    document.body.innerHTML = DOMPurify.sanitize(e.data);

    document.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const target = event.target as HTMLAnchorElement;
            history.pushState(null, "", target.href);
            loadURLContent();
        });
    });
};

window.addEventListener("popstate", (event) => {
    loadURLContent();
});

loadURLContent();
