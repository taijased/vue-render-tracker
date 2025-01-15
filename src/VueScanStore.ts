/**
 * VueScanStore - A store class for managing VueScan plugin data and options.
 * This class acts as a centralized storage for plugin options and render information.
 */

import type { IRenderInfo, IVueScanOptions } from './types';

/**
 * VueScanStore Class
 * Handles the storage of plugin options and render information, providing methods for updating and retrieving data.
 */
export class VueScanStore {
	private _options: IVueScanOptions; // Stores the plugin options.
	private _reportData: Map<string, IRenderInfo> = new Map(); // Stores render information with unique keys.

	/**
	 * Constructor - Initializes the store with given options.
	 * @param options The initial configuration options for the VueScan plugin.
	 */
	constructor(options: IVueScanOptions) {
		this._options = options;
	}

	/**
	 * Getter for options - Retrieves the current plugin configuration options.
	 * @returns The current IVueScanOptions object.
	 */
	get options(): IVueScanOptions {
		return this._options;
	}

	/**
	 * Setter for options - Updates the plugin configuration options.
	 * @param newOpts The new configuration options to merge with the current options.
	 */
	set options(newOpts: IVueScanOptions) {
		this._options = { ...this._options, ...newOpts }; // Merge new options with existing ones.
	}

	/**
	 * setRenderInfo - Adds or updates render information for a specific key.
	 * @param key The unique key associated with the render information.
	 * @param info The IRenderInfo object containing render details.
	 */
	public setRenderInfo(key: string, info: IRenderInfo) {
		this._reportData.set(key, info); // Store or update the render information.
	}

	/**
	 * getRenderInfo - Retrieves render information for a specific key.
	 * @param key The unique key associated with the render information.
	 * @returns The IRenderInfo object if the key exists, otherwise undefined.
	 */
	public getRenderInfo(key: string): IRenderInfo | undefined {
		return this._reportData.get(key); // Retrieve the render information.
	}

	/**
	 * getAllReports - Retrieves all stored render information as an array of key-value pairs.
	 * @returns An array of tuples, where each tuple contains a key and its associated IRenderInfo.
	 */
	public getAllReports(): Array<[string, IRenderInfo]> {
		return Array.from(this._reportData.entries()); // Convert the map entries to an array.
	}
}
