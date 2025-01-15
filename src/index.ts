import {createApp} from "vue";
import {VueScanPlugin} from "./VueScanPlugin";
export {VueScanPlugin};

if (typeof window !== "undefined" && (window as any).Vue) {
    const appElement = document.getElementById("app");
    if (appElement) {
        const app = createApp({});
        const vueScan = new VueScanPlugin({
            enabled: true,
            showOverlay: true,
            log: false,
            playSound: false,
        });

        app.use(vueScan);
        app.mount("#app");

        vueScan.start();

        (window as any).VueRenderTracker = vueScan;
    } else {
        console.error("No element with ID 'app' found for mounting Vue.");
    }
}
