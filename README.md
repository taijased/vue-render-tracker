# Vue Render Tracker

Vue Render Tracker is a Vue 3 library that helps developers track component renders in their applications. It provides an easy way to visualize and log rendering performance to help optimize your app.

![Vue Render Tracker Demo](/src/assets/demo.gif)

## Installation

Install the library using npm:

```bash
npm install @taijased/vue-render-tracker
```

## Usage

Here is how you can use `VueRenderTracker` in your Vue 3 application:

```javascript
import {createApp} from "vue";
import {VueScanPlugin} from "@taijased/vue-render-tracker";
import App from "./App.vue";

const app = createApp(App);

const vueScan = new VueScanPlugin({
    enabled: true, // Enable or disable the tracker
    showOverlay: true, // Show overlay to visualize renders
    log: false, // Log render events to the console
    playSound: false, // Play sound on each render
});

app.use(vueScan);
app.mount("#app");
```

### Options

-   **enabled**: `boolean` (default: `true`)

    -   Enable or disable the render tracker.

-   **showOverlay**: `boolean` (default: `true`)

    -   Show a visual overlay to track render events.

-   **log**: `boolean` (default: `false`)

    -   Log render events to the console.

-   **playSound**: `boolean` (default: `false`)
    -   Play a sound on every render event.

## Example

### Basic App.vue

```vue
<template>
    <div id="app">
        <h1>Vue Render Tracker Example</h1>
        <button @click="updateCounter">Click Me</button>
        <p>Counter: {{ counter }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            counter: 0,
        };
    },
    methods: {
        updateCounter() {
            this.counter++;
        },
    },
};
</script>
```

When the button is clicked, the overlay will highlight renders, helping you understand when and where renders occur in your application.

## Development

If you want to contribute or debug the library locally:

1. Clone the repository:

    ```bash
    git clone https://github.com/taijased/vue-render-tracker.git
    cd vue-render-tracker
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Build the library:

    ```bash
    npm run build
    ```

4. Link the library locally:

    ```bash
    npm link
    ```

5. Use the library in another project:
    ```bash
    npm link @taijased/vue-render-tracker
    ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributing

Contributions are welcome! If you have any ideas, issues, or improvements, feel free to submit a pull request or open an issue on [GitHub](https://github.com/taijased/vue-render-tracker).

## Contact

-   **Author**: Maxim Spiridonov
-   **Email**: [taijased@gmail.com](mailto:taijased@gmail.com)
-   **GitHub**: [https://github.com/taijased](https://github.com/taijased)

---

Enjoy building better and faster Vue apps with Vue Render Tracker!
