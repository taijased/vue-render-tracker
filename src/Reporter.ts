// Reporter.ts

import type { IRenderInfo, IVueScanOptions } from './types';

/**
 * Reporter class handles logging and auditory feedback for VueScan.
 * It uses the provided options to determine whether to log render information
 * and play a sound when a render update is detected.
 */
export class Reporter {
	constructor(private options: IVueScanOptions) {}

	/**
	 * Logs render information to the console if logging is enabled in the options.
	 *
	 * @param info - Render information containing component name and changes.
	 */
	public logRender(info: IRenderInfo): void {
		if (!this.options.log) return; // Skip logging if disabled
		console.log('[VueScan] Updated:', info.componentName, info);
	}

	/**
	 * Plays a short beep sound if auditory feedback is enabled in the options.
	 *
	 * @param info - Render information (not used directly in this method).
	 */
	public playSoundIfNeeded(info: IRenderInfo): void {
		if (!this.options.playSound) return; // Skip sound if disabled

		// Generate a simple "beep" sound using the Web Audio API
		const beep = new AudioContext();
		const oscillator = beep.createOscillator();
		oscillator.frequency.value = 440; // Frequency in Hz (A4 note)
		oscillator.connect(beep.destination);
		oscillator.start();

		setTimeout(() => {
			oscillator.stop();
			beep.close();
		}, 50); // Sound duration: 50ms
	}
}
