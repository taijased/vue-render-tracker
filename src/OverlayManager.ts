// OverlayManager.ts

/**
 * Interface representing the shape of an overlay rectangle.
 * Defines the position, size, color, optional border properties,
 * and the animation duration for fade effects.
 */
export interface IOverlayShape {
	x: number; // X-coordinate of the rectangle
	y: number; // Y-coordinate of the rectangle
	width: number; // Width of the rectangle
	height: number; // Height of the rectangle
	color: string; // Fill color of the rectangle

	// Optional border properties
	borderColor?: string; // Color of the border
	borderWidth?: number; // Thickness of the border

	fadeDuration: number; // Duration of the fade effect in milliseconds
	startTime: number; // Timestamp marking when the fade effect starts
}

/**
 * OverlayManager is a utility for managing and rendering visual overlays on a web page.
 * It supports adding rectangles with customizable styles and fade-out animations.
 */
export class OverlayManager {
	private canvas: HTMLCanvasElement; // Canvas element for drawing
	private ctx: CanvasRenderingContext2D | null = null; // 2D rendering context

	// List of shapes to render
	private shapes: IOverlayShape[] = [];

	// Used to track animation state
	private animationFrameId: number | null = null;

	/**
	 * Initializes the OverlayManager with a given container.
	 *
	 * @param container - The DOM element where the canvas will be appended.
	 */
	constructor(container: HTMLElement) {
		this.canvas = document.createElement('canvas');
		this.canvas.style.position = 'fixed';
		this.canvas.style.left = '0';
		this.canvas.style.top = '0';
		this.canvas.style.zIndex = '999999';
		this.canvas.style.pointerEvents = 'none'; // Prevent interaction with the canvas
		container.appendChild(this.canvas);

		this.ctx = this.canvas.getContext('2d');
		this.onResize();
		window.addEventListener('resize', () => this.onResize());
	}

	/**
	 * Handles canvas resizing to match the window dimensions.
	 * Adjusts for device pixel ratio to ensure sharp rendering.
	 */
	private onResize() {
		const ratio = window.devicePixelRatio || 1;
		this.canvas.width = Math.floor(window.innerWidth * ratio);
		this.canvas.height = Math.floor(window.innerHeight * ratio);
		this.canvas.style.width = `${window.innerWidth}px`;
		this.canvas.style.height = `${window.innerHeight}px`;

		if (this.ctx) {
			this.ctx.scale(ratio, ratio);
		}
	}

	/**
	 * Clears all shapes and stops the animation loop.
	 * Can be called manually to reset the overlay.
	 */
	public clear() {
		this.shapes = [];
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}

		if (!this.ctx) return;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	/**
	 * Draws a rectangle with an optional fade-out animation.
	 *
	 * @param params - Configuration object for the rectangle, including size, position,
	 *                 color, border properties, and fade duration.
	 */
	public drawRect({
		x,
		y,
		width,
		height,
		color = 'rgba(142,97,227,0.5)', // Default fill color
		borderColor = 'rgba(142,97,227,1)', // Default border color
		borderWidth = 1, // Default border width
		fadeDuration = 500 // Default fade duration in ms
	}: {
		x: number;
		y: number;
		width: number;
		height: number;
		color?: string;
		borderColor?: string;
		borderWidth?: number;
		fadeDuration?: number;
	}) {
		const shape: IOverlayShape = {
			x,
			y,
			width,
			height,
			color,
			borderColor,
			borderWidth,
			fadeDuration,
			startTime: Date.now()
		};

		this.shapes.push(shape);

		// Start the animation loop if not already running
		if (!this.animationFrameId) {
			this.animationFrameId = requestAnimationFrame(() =>
				this.renderLoop()
			);
		}
	}

	/**
	 * Main rendering loop that updates the canvas on each frame.
	 * Clears the canvas, redraws shapes, and handles fade-out logic.
	 */
	private renderLoop() {
		this.animationFrameId = requestAnimationFrame(() => this.renderLoop());

		if (!this.ctx) return;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		const now = Date.now();

		// Filter out shapes whose fade duration has expired
		this.shapes = this.shapes.filter((shape) => {
			const elapsed = now - shape.startTime;
			if (elapsed >= shape.fadeDuration) {
				return false; // Remove expired shape
			}
			// Draw the shape with reduced opacity
			const alpha = 1 - elapsed / shape.fadeDuration; // Opacity decreases from 1 to 0
			this.drawShape(shape, alpha);
			return true;
		});

		// Stop the animation loop if no shapes remain
		if (this.shapes.length === 0) {
			if (this.animationFrameId) {
				cancelAnimationFrame(this.animationFrameId);
				this.animationFrameId = null;
			}
		}
	}

	/**
	 * Draws an individual shape on the canvas with a specified opacity.
	 *
	 * @param shape - The shape to draw.
	 * @param alpha - The opacity level (0 to 1).
	 */
	private drawShape(shape: IOverlayShape, alpha: number) {
		if (!this.ctx) return;

		this.ctx.save();
		this.ctx.globalAlpha = alpha;

		// Draw the filled rectangle
		this.ctx.fillStyle = shape.color;
		this.ctx.fillRect(shape.x, shape.y, shape.width, shape.height);

		// Draw the border if specified
		if (shape.borderColor && shape.borderWidth) {
			this.ctx.strokeStyle = shape.borderColor;
			this.ctx.lineWidth = shape.borderWidth;
			this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
		}

		this.ctx.restore();
	}
}
