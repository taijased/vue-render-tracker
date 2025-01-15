// types.ts

/**
 * Options to configure the VueScan tool.
 * Used to enable or disable tracking, logging, sound effects, overlays, and updates.
 */
export interface IVueScanOptions {
	enabled: boolean; // Enables or disables VueScan functionality
	log: boolean; // Enables logging of tracked updates
	playSound: boolean; // Plays a sound when a change is detected
	showOverlay: boolean; // Displays a visual overlay for changes
	trackUpdates: boolean; // Tracks updates in the application
}

/**
 * Represents a single change detected during rendering.
 * Stores the property name, its old value, and its new value.
 */
export interface IRenderChange {
	name: string; // Name of the changed property
	oldValue?: unknown; // The previous value of the property (optional)
	newValue?: unknown; // The updated value of the property (optional)
}

/**
 * Contains detailed information about a component's render event.
 * Tracks the component name, list of changes, update count, and timestamp.
 */
export interface IRenderInfo {
	componentName: string; // Name of the component being tracked
	changes: IRenderChange[]; // List of detected changes during the render
	updateCount: number; // Total number of updates for the component
	timestamp: number; // Timestamp of when the render occurred
}

/**
 * Represents the properties of an overlay rectangle used for highlighting UI updates.
 */
export interface IOverlayRect {
	x: number; // X-coordinate of the rectangle
	y: number; // Y-coordinate of the rectangle
	width: number; // Width of the rectangle
	height: number; // Height of the rectangle
	color?: string; // Optional fill color of the rectangle
	alpha?: number; // Optional opacity level of the rectangle (0 to 1)
}
