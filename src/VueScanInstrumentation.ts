// VueScanInstrumentation.ts

import type { App } from 'vue';
import { OverlayManager } from './OverlayManager';
import { Reporter } from './Reporter';
import { VueScanStore } from './VueScanStore';
import type { IRenderChange, IRenderInfo } from './types';

/**
 * VueScanInstrumentation handles the integration of VueScan into a Vue 3 application.
 * It tracks component updates, logs changes, provides visual feedback, and manages overlays.
 */
export class VueScanInstrumentation {
	private store: VueScanStore; // Manages tracked data and options
	private reporter: Reporter; // Handles logging and auditory feedback
	private paused = false; // Toggles tracking and instrumentation
	private overlay?: OverlayManager; // Manages visual overlays (optional)

	/**
	 * Initializes the VueScanInstrumentation with the given store, reporter, and optional overlay.
	 *
	 * @param store - Instance of VueScanStore for managing render data.
	 * @param reporter - Instance of Reporter for logging and sound feedback.
	 * @param overlay - Optional OverlayManager for visual feedback.
	 */
	constructor(
		store: VueScanStore,
		reporter: Reporter,
		overlay?: OverlayManager
	) {
		this.store = store;
		this.reporter = reporter;
		this.overlay = overlay;
	}

	/**
	 * Pauses or resumes the instrumentation.
	 *
	 * @param p - Boolean value indicating whether to pause tracking.
	 */
	public setPaused(p: boolean) {
		this.paused = p;
	}

	/**
	 * Registers a global Vue mixin to track component lifecycle hooks.
	 *
	 * @param app - The Vue application instance.
	 */
	public registerGlobalMixin(app: App) {
		const instrumentation = this;

		app.mixin({
			data() {
				return {
					vueScanUpdateCount: 0 // Tracks the number of updates for the component
				};
			},
			beforeUpdate() {
				// Increment the update counter before each update
				if (this.vueScanUpdateCount != null) {
					this.vueScanUpdateCount++;
				}
			},
			updated() {
				if (this.vueScanUpdateCount == null) return;
				const count = this.vueScanUpdateCount;

				// Determine the component's name
				const compName =
					this.$options?.name ||
					this.$options?.__name ||
					'UnknownVueComponent';

				// Get the DOM element and its bounding rectangle
				const el = this.$el as HTMLElement | undefined;
				if (el instanceof HTMLElement) {
					const rect = el.getBoundingClientRect();
					instrumentation.handleRender(compName, count, rect);
				} else {
					instrumentation.handleRender(compName, count);
				}
			},
			mounted() {
				// Handle the first render on mount
				const compName =
					this.$options?.name ||
					this.$options?.__name ||
					'UnknownVueComponent';

				const el = this.$el as HTMLElement | undefined;
				if (el instanceof HTMLElement) {
					const rect = el.getBoundingClientRect();
					instrumentation.handleRender(compName, 0, rect);
				} else {
					instrumentation.handleRender(compName, 0);
				}
			}
		});
	}

	/**
	 * Handles rendering logic, including logging, auditory feedback, and overlay drawing.
	 *
	 * @param name - The name of the component being rendered.
	 * @param count - The update count for the component.
	 * @param rect - Optional bounding rectangle of the component's root element.
	 */
	private handleRender(name: string, count: number, rect?: DOMRect) {
		if (this.paused) return;
		if (!this.store.options.trackUpdates) return;

		// Create render information
		const info: IRenderInfo = {
			componentName: name,
			changes: this.getChangesStub(),
			updateCount: count,
			timestamp: Date.now()
		};

		// Save the render information in the store
		this.store.setRenderInfo(name, info);

		// Log the render event and play sound if enabled
		this.reporter.logRender(info);
		this.reporter.playSoundIfNeeded(info);

		// Draw a visual overlay if enabled and a rectangle is provided
		if (this.overlay && rect) {
			this.overlay.clear();
			this.overlay.drawRect({
				x: rect.left,
				y: rect.top,
				width: rect.width,
				height: rect.height
			});
			setTimeout(() => {
				this.overlay?.clear();
			}, 50); // Clear the overlay after 50ms
		}
	}

	/**
	 * Placeholder for generating render change details.
	 *
	 * @returns An empty array of changes as a stub.
	 */
	private getChangesStub(): IRenderChange[] {
		// In a real implementation, analyze and return the actual changes
		return [];
	}
}
