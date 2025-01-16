export {VueScanPlugin};
import {VueScanPlugin} from "./VueScanPlugin"; // Импорт вашего плагина

// Функция для инициализации плагина
function initVueRenderTracker(vueInstance) {
    if (!vueInstance || !vueInstance.config) {
        console.error(
            "VueInstance не инициализирован или имеет неверную структуру."
        );
        return;
    }

    if (!vueInstance.config.globalProperties.$vueRenderTracker) {
        const vueScan = new VueScanPlugin({
            enabled: true,
            showOverlay: true,
            log: false,
            playSound: false,
        });

        vueInstance.use(vueScan); // Регистрируем плагин
        vueScan.start();

        // Экспортируем в глобальную область видимости
        window.VueRenderTracker = vueScan;
        console.log("VueRenderTracker успешно инициализирован.");
    } else {
        console.warn("VueScanPlugin уже подключён к текущему Vue-контексту.");
    }
}

// Проверяем, доступен ли Vue в глобальной области
if (typeof window !== "undefined") {
    if (window.Vue) {
        console.log(
            "Vue найден в глобальной области. Инициализация плагина..."
        );
        const app = window.Vue.createApp({}); // Создаем пустое приложение, если оно отсутствует
        initVueRenderTracker(app);
        app.mount("#app");
    } else {
        console.error(
            "Vue не найден в глобальной области видимости. Проверьте подключение Vue."
        );
    }
} else {
    console.error("Скрипт запущен вне браузерной среды.");
}
