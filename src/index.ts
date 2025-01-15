import {VueScanPlugin} from "./VueScanPlugin";

export {VueScanPlugin};

// Автоматическая регистрация для глобальной версии
if (typeof window !== "undefined" && (window as any).Vue) {
    const VueScan = new VueScanPlugin({
        enabled: true,
        showOverlay: true,
        log: false,
        playSound: false,
    });

    (window as any).Vue.use(VueScan);

    const app = (window as any).Vue.createApp({});
    app.mount("#app");
    VueScan.start();

    (window as any).VueRenderTracker = VueScan; // Экспорт глобального объекта
}
