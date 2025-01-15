/**
 * VueScanPlugin - A Vue 3 plugin for scanning and tracking updates with optional overlays and reporting.
 * This plugin allows you to track Vue application updates and interactions in real time.
 */

import type { App } from 'vue';
import { OverlayManager } from './OverlayManager';
import { Reporter } from './Reporter';
import { VueScanInstrumentation } from './VueScanInstrumentation';
import { VueScanStore } from './VueScanStore';
import type { IVueScanOptions } from './types';

/**
 * Default options for the VueScanPlugin. These can be overridden by passing custom options.
 */
const defaultOptions: IVueScanOptions = {
	enabled: true, // Enables or disables the plugin.
	log: true, // Enables or disables logging.
	playSound: false, // Plays a sound on specific interactions if enabled.
	showOverlay: false, // Displays an overlay for visual feedback if enabled.
	trackUpdates: true // Tracks updates in the Vue application.
};

/**
 * VueScanPlugin Class
 * The main plugin class that manages the lifecycle, options, and functionality of the plugin.
 */
export class VueScanPlugin {
	private store: VueScanStore; // Stores plugin options and state.
	private instrumentation: VueScanInstrumentation; // Handles Vue application instrumentation.
	private overlay?: OverlayManager; // Manages the overlay for visual feedback (optional).
	private reporter: Reporter; // Handles reporting for the plugin.

	/**
	 * Constructor - Initializes the plugin with user-provided or default options.
	 * @param options Partial options to override the default plugin configuration.
	 */
	constructor(options?: Partial<IVueScanOptions>) {
		// Merge user-provided options with the default options.
		const merged = { ...defaultOptions, ...(options || {}) };
		this.store = new VueScanStore(merged); // Initialize the store with merged options.
		this.reporter = new Reporter(this.store.options); // Initialize the reporter with store options.

		// If overlays are enabled, create an OverlayManager instance.
		if (merged.enabled && merged.showOverlay) {
			this.overlay = new OverlayManager(document.body);
		}

		// Initialize instrumentation with the store, reporter, and optional overlay.
		this.instrumentation = new VueScanInstrumentation(
			this.store,
			this.reporter,
			this.overlay
		);
	}

	/**
	 * install - Installs the plugin into a Vue application.
	 * @param app The Vue application instance.
	 */
	public install(app: App): void {
		if (this.store.options.enabled) {
			this.instrumentation.registerGlobalMixin(app); // Register global mixins for tracking.
		}
		// Expose the plugin instance to the Vue global properties.
		app.config.globalProperties.$vueScan = this;
	}

	/**
	 * start - Starts the plugin and enables tracking.
	 */
	public start() {
		console.log('Starting VueScan');
		this.instrumentation.setPaused(false); // Resume tracking.
	}

	/**
	 * stop - Stops the plugin and disables tracking.
	 */
	public stop() {
		this.instrumentation.setPaused(true); // Pause tracking.
		this.overlay?.clear(); // Clear the overlay if it exists.
	}

	/**
	 * updateOptions - Updates the plugin configuration options at runtime.
	 * @param opts Partial options to merge with the current configuration.
	 */
	public updateOptions(opts: Partial<IVueScanOptions>) {
		this.store.options = { ...this.store.options, ...opts }; // Update store options.
		this.reporter = new Reporter(this.store.options); // Reinitialize the reporter with new options.
	}

	/**
	 * highlightRect - Manually draws a rectangle on the overlay for highlighting.
	 * @param x The x-coordinate of the rectangle.
	 * @param y The y-coordinate of the rectangle.
	 * @param w The width of the rectangle.
	 * @param h The height of the rectangle.
	 */
	public highlightRect(x: number, y: number, w: number, h: number) {
		if (!this.overlay) return; // If overlay is not enabled, do nothing.
		this.overlay.clear(); // Clear any existing overlay drawings.
		this.overlay.drawRect({ x, y, width: w, height: h }); // Draw the rectangle.
	}

	/**
	 * getAllReports - Retrieves all reports collected by the plugin.
	 * @returns An array of all reports.
	 */
	public getAllReports() {
		return this.store.getAllReports();
	}
}
