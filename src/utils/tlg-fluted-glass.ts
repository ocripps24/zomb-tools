/**
 * TLG Fluted Glass Effect
 *
 * MIT License
 *
 * Copyright (c) 2024 thelazygod
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT SHALL BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as THREE from "three";

interface FlutedGlassOptions {
	dom: HTMLElement;
}

const vertex = `
varying vec2 vUv;
void main() {
vUv = uv;
gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;

const fragment = `
precision mediump float;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;
uniform float uImageAspect;
uniform vec3 uOverlayColor;
uniform vec3 uOverlayColorWhite;
uniform float uMotionValue;
uniform float uRotation;
uniform float uSegments;
uniform float uOverlayOpacity;
uniform float uIntensity;

void main() {
    float canvasAspect = resolution.x / resolution.y;
    float numSlices = uSegments;
    float rotationRadians = uRotation * (3.14159265 / 180.0); // Convert rotation to radians

    // Adjust the UV coordinates for aspect ratio
    vec2 scaledUV = vUv;
    if (uImageAspect > canvasAspect) {
        float scale = canvasAspect / uImageAspect;
        scaledUV.x = (vUv.x - 0.5) * scale + 0.5;
    } else {
        float scale = uImageAspect / canvasAspect;
        scaledUV.y = (vUv.y - 0.5) * scale + 0.5;
    }

    // Rotate the texture to align it with the warping axis
    vec2 rotatedUV = vec2(
        cos(rotationRadians) * (scaledUV.x - 0.5) - sin(rotationRadians) * (scaledUV.y - 0.5) + 0.5,
        sin(rotationRadians) * (scaledUV.x - 0.5) + cos(rotationRadians) * (scaledUV.y - 0.5) + 0.5
    );

    // Apply the warping effect along the aligned axis (now horizontal after rotation)
    float sliceProgress = fract(rotatedUV.x * numSlices + uMotionValue);
    float amplitude = 0.015 * (uIntensity / 50.0); // Scale amplitude by intensity (0-100, normalized to 0-2x)
    rotatedUV.x += amplitude * sin(sliceProgress * 3.14159265 * 2.0) * (1.0 - 0.5 * abs(sliceProgress - 0.5));

    // Rotate the UVs back to the original orientation
    vec2 finalUV = vec2(
        cos(-rotationRadians) * (rotatedUV.x - 0.5) - sin(-rotationRadians) * (rotatedUV.y - 0.5) + 0.5,
        sin(-rotationRadians) * (rotatedUV.x - 0.5) + cos(-rotationRadians) * (rotatedUV.y - 0.5) + 0.5
    );

    // Tile texture on edges using the final UVs
    vec2 tileIndex = floor(finalUV);
    vec2 oddTile = mod(tileIndex, 2.0);
    vec2 mirroredUV = mix(fract(finalUV), 1.0 - fract(finalUV), oddTile);
    vec4 color = texture2D(uTexture, mirroredUV);

    if (uOverlayOpacity > 0.0) {
        // Apply overlays with the specified opacity
        float blackOverlayAlpha = 0.05 * (1.0 - abs(sin(sliceProgress * 3.14159265 * 0.5 + 1.57))) * (uOverlayOpacity / 100.0);
        color.rgb *= (1.0 - blackOverlayAlpha);

        float whiteOverlayAlpha = 0.15 * (1.0 - abs(sin(sliceProgress * 3.14159265 * 0.7 - 0.7))) * (uOverlayOpacity / 100.0);
        color.rgb = mix(color.rgb, uOverlayColorWhite, whiteOverlayAlpha);
    }

    gl_FragColor = color;
}
`;

class FlutedGlassSketch {
	private scene: THREE.Scene;
	private container: HTMLElement;
	private width: number;
	private height: number;
	private renderer: THREE.WebGLRenderer;
	private mode: "static" | "mouse" | "scroll";
	private motionFactor: number;
	private camera: THREE.OrthographicCamera;
	private isPlaying: boolean;
	private material?: THREE.ShaderMaterial;
	private geometry?: THREE.PlaneGeometry;
	private plane?: THREE.Mesh;
	private mouse: THREE.Vector2;
	private rotationAngle: number = 0;
	private segments: number = 80;
	private overlayOpacity: number = 0;
	private imageAspect: number = 1;
	private intensity: number = 50;
	private videoTexture?: THREE.VideoTexture;
	private lastMouseMove: number = 0;
	private mouseInfluence: number = 0; // 0-1 blend factor between ambient and mouse

	constructor(options: FlutedGlassOptions) {
		this.scene = new THREE.Scene();
		this.mouse = new THREE.Vector2(0.5, 0.5);

		this.container = options.dom;
		const position = getComputedStyle(this.container).position;
		if (
			position !== "relative" &&
			position !== "absolute" &&
			position !== "fixed" &&
			position !== "sticky"
		) {
			this.container.style.position = "relative";
		}

		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;
		this.renderer = new THREE.WebGLRenderer({ alpha: true });
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.renderer.setSize(this.width, this.height);
		this.renderer.setClearColor(0x000000, 0);

		const modeAttr = this.container.getAttribute("tlg-fluted-glass-mode");
		this.mode =
			modeAttr && ["static", "mouse", "scroll"].includes(modeAttr)
				? (modeAttr as "static" | "mouse" | "scroll")
				: "static";
		const motionAttr = this.container.getAttribute("tlg-fluted-glass-motion");
		this.motionFactor = -50 * parseFloat(motionAttr || "1") || -50;

		this.container.appendChild(this.renderer.domElement);

		var frustumSize = 1;
		this.camera = new THREE.OrthographicCamera(
			frustumSize / -2,
			frustumSize / 2,
			frustumSize / 2,
			frustumSize / -2,
			-1000,
			1000
		);
		this.camera.position.set(0, 0, 2);

		this.isPlaying = true;
		this.addObjects();
		this.resize();
		this.render();
		this.setupResize();

		if (this.mode === "mouse") {
			this.mouseEvents();
		}
		if (this.mode === "scroll") {
			this.setupScroll();
		}
	}

	mouseEvents(): void {
		this.container.addEventListener("mousemove", (event) => {
			this.onMouseMove(event);
		});
	}

	setupScroll(): void {
		window.addEventListener("scroll", this.handleScroll.bind(this));
	}

	handleScroll(): void {
		const rect = this.container.getBoundingClientRect();
		const elemTop = rect.top;
		const elemBottom = rect.bottom;

		// Check if the element is in the viewport
		const isInViewport = elemTop < window.innerHeight && elemBottom >= 0;

		if (isInViewport) {
			const totalHeight = window.innerHeight + this.container.offsetHeight;
			const scrolled = window.innerHeight - elemTop;
			const progress = scrolled / totalHeight;
			const maxMovement = 0.2; // Full rotation
			if (this.material) {
				this.material.uniforms.uMotionValue.value =
					progress * maxMovement * this.motionFactor;
			}
		}
	}

	onMouseMove(event: MouseEvent): void {
		const rect = this.container.getBoundingClientRect();
		this.mouse.x = (event.clientX - rect.left) / rect.width;
		this.mouse.y = 1.0 - (event.clientY - rect.top) / rect.height;
		this.lastMouseMove = Date.now();
		if (this.material) {
			this.material.uniforms.uMotionValue.value =
				0.5 + this.mouse.x * this.motionFactor * 0.1;
		}
	}

	setupResize(): void {
		window.addEventListener("resize", this.resize.bind(this));
	}

	resize(): void {
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;
		this.renderer.setSize(this.width, this.height);

		if (this.material) {
			this.material.uniforms.resolution.value.x = this.width;
			this.material.uniforms.resolution.value.y = this.height;
		}
		this.camera.updateProjectionMatrix();
	}

	addObjects(): void {
		// Set rotation angle
		const rotationAttribute = this.container.getAttribute(
			"tlg-fluted-glass-rotation"
		);
		this.rotationAngle = parseFloat(rotationAttribute || "0") || 0; // Default to 0

		// Set number of segments
		const segmentsAttribute = this.container.getAttribute(
			"tlg-fluted-glass-segments"
		);
		this.segments = parseInt(segmentsAttribute || "80", 10) || 80; // Default to 80

		// Get overlay opacity value from attribute
		const overlaysAttr = this.container.getAttribute(
			"tlg-fluted-glass-overlay"
		);
		this.overlayOpacity = Math.max(
			0,
			Math.min(100, parseFloat(overlaysAttr || "0") || 0)
		); // Clamp between 0 and 100

		// Get intensity value from attribute (controls warping strength)
		const intensityAttr = this.container.getAttribute(
			"tlg-fluted-glass-intensity"
		);
		this.intensity = Math.max(
			0,
			Math.min(100, parseFloat(intensityAttr || "50") || 50)
		); // Clamp between 0 and 100

		// Check for video element first
		const videoElements = this.container.querySelectorAll<HTMLVideoElement>(
			"[tlg-fluted-glass-video]"
		);
		if (videoElements.length > 0) {
			const videoElement = videoElements[0];

			// Ensure video plays
			videoElement
				.play()
				.catch((err) => console.log("Video autoplay prevented:", err));

			// For video, set aspect ratio from video dimensions once loaded
			if (videoElement.videoWidth && videoElement.videoHeight) {
				this.imageAspect = videoElement.videoWidth / videoElement.videoHeight;
				this.setupMaterialAndGeometryWithVideo(videoElement);
			} else {
				videoElement.addEventListener("loadedmetadata", () => {
					this.imageAspect = videoElement.videoWidth / videoElement.videoHeight;
					videoElement
						.play()
						.catch((err) => console.log("Video autoplay prevented:", err));
					this.setupMaterialAndGeometryWithVideo(videoElement);
				});
			}
			return;
		}

		// Fallback to image elements
		const imageElements = this.container.querySelectorAll<HTMLImageElement>(
			"[tlg-fluted-glass-image]"
		);
		const randomImageElement =
			imageElements[Math.floor(Math.random() * imageElements.length)];

		if (!randomImageElement) {
			console.error(
				"No image or video element found with [tlg-fluted-glass-image] or [tlg-fluted-glass-video] attribute"
			);
			return;
		}

		// Create a new Image object to load the texture
		const image = new Image();
		image.crossOrigin = "anonymous";
		image.onload = () => {
			// Calculate the aspect ratio automatically
			this.imageAspect = image.naturalWidth / image.naturalHeight;
			// Once the image is loaded and the aspect ratio is calculated, set up the material and geometry
			this.setupMaterialAndGeometry(randomImageElement.src);
		};
		// Set the image source to start loading
		image.src = randomImageElement.src;
	}

	setupMaterialAndGeometryWithVideo(videoElement: HTMLVideoElement): void {
		const rendererElement = this.renderer.domElement;
		// Set styles for generated canvas
		rendererElement.style.position = "absolute";
		rendererElement.style.top = "0";
		rendererElement.style.left = "0";
		rendererElement.style.width = "100%";
		rendererElement.style.height = "100%";

		// Append the renderer element to the container
		this.container.appendChild(rendererElement);

		console.log(
			"Setting up video texture. Video playing:",
			!videoElement.paused,
			"Video currentTime:",
			videoElement.currentTime
		);

		// Create video texture that updates each frame
		this.videoTexture = new THREE.VideoTexture(videoElement);
		this.videoTexture.minFilter = THREE.LinearFilter;
		this.videoTexture.magFilter = THREE.LinearFilter;

		// Log video state changes
		videoElement.addEventListener("play", () =>
			console.log("Video started playing")
		);
		videoElement.addEventListener("pause", () => console.log("Video paused"));

		this.material = new THREE.ShaderMaterial({
			side: THREE.DoubleSide,
			uniforms: {
				resolution: {
					value: new THREE.Vector4(),
				},
				uTexture: {
					value: this.videoTexture,
				},
				uMotionValue: {
					value: 0.5,
				},
				uRotation: {
					value: this.rotationAngle,
				},
				uSegments: {
					value: this.segments,
				},
				uOverlayColor: {
					value: new THREE.Vector3(0.0, 0.0, 0.0),
				},
				uOverlayColorWhite: {
					value: new THREE.Vector3(1.0, 1.0, 1.0),
				},
				uImageAspect: {
					value: this.imageAspect,
				},
				uOverlayOpacity: {
					value: this.overlayOpacity,
				},
				uIntensity: {
					value: this.intensity,
				},
			},
			vertexShader: vertex,
			fragmentShader: fragment,
			transparent: true,
		});

		this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
		this.plane = new THREE.Mesh(this.geometry, this.material);
		this.scene.add(this.plane);

		this.resize();
		this.handleScroll();
	}

	setupMaterialAndGeometry(imageSrc: string): void {
		const rendererElement = this.renderer.domElement;
		// Set styles for generated canvas
		rendererElement.style.position = "absolute";
		rendererElement.style.top = "0";
		rendererElement.style.left = "0";
		rendererElement.style.width = "100%";
		rendererElement.style.height = "100%";

		// Append the renderer element to the container
		this.container.appendChild(rendererElement);

		let texture = new THREE.TextureLoader().load(imageSrc);
		texture.minFilter = THREE.LinearFilter;

		this.material = new THREE.ShaderMaterial({
			side: THREE.DoubleSide,
			uniforms: {
				resolution: {
					value: new THREE.Vector4(),
				},
				uTexture: {
					value: texture,
				},
				uMotionValue: {
					value: 0.5,
				},
				uRotation: {
					value: this.rotationAngle,
				},
				uSegments: {
					value: this.segments,
				},
				uOverlayColor: {
					value: new THREE.Vector3(0.0, 0.0, 0.0),
				},
				uOverlayColorWhite: {
					value: new THREE.Vector3(1.0, 1.0, 1.0),
				},
				uImageAspect: {
					value: this.imageAspect,
				},
				uOverlayOpacity: {
					value: this.overlayOpacity,
				},
				uIntensity: {
					value: this.intensity,
				},
			},
			vertexShader: vertex,
			fragmentShader: fragment,
			transparent: true,
		});

		this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
		this.plane = new THREE.Mesh(this.geometry, this.material);
		this.scene.add(this.plane);

		this.resize();
		this.handleScroll();
	}

	render(time: number = 0): void {
		if (!this.isPlaying) return;

		// Check if mouse was active recently (no delay - starts fading immediately)
		const timeSinceMouseMove = Date.now() - this.lastMouseMove;
		const mouseIsActive = timeSinceMouseMove < 400; // Very short delay (0.1s)

		// Blend factor approach - both motions always active
		if (this.mode === "mouse" && this.material) {
			// Calculate ambient sine wave (always running) - increased speed
			const ambientValue = 0.5 + Math.sin(time * 0.001) * 0.3; // 0.001 = 3x faster

			// Calculate mouse-controlled value (70% horizontal, 30% vertical)
			const mouseValue = 0.5 + (this.mouse.x * 0.7 + this.mouse.y * 0.3) * this.motionFactor * 0.1;

			// Smoothly fade mouse influence in/out
			const targetInfluence = mouseIsActive ? 1 : 0;
			const influenceLerpSpeed = 0.01; // Faster fade to reduce elastic feeling
			this.mouseInfluence +=
				(targetInfluence - this.mouseInfluence) * influenceLerpSpeed;

			// Blend between ambient and mouse values based on influence
			const finalValue =
				ambientValue + (mouseValue - ambientValue) * this.mouseInfluence;

			this.material.uniforms.uMotionValue.value = finalValue;

			// Dynamically adjust segments based on mouse interaction
			const ambientSegments = this.segments; // Base segment count
			const mouseSegments = this.segments * 1.5; // 50% more detail during interaction
			const finalSegments = ambientSegments + (mouseSegments - ambientSegments) * this.mouseInfluence;
			this.material.uniforms.uSegments.value = finalSegments;
		}

		requestAnimationFrame(this.render.bind(this));
		this.renderer.render(this.scene, this.camera);
	}

	destroy(): void {
		this.isPlaying = false;
		if (
			this.renderer &&
			this.renderer.domElement &&
			this.renderer.domElement.parentNode
		) {
			this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
		}
		if (this.geometry) this.geometry.dispose();
		if (this.material) this.material.dispose();
		if (this.renderer) this.renderer.dispose();
	}
}

// Initialize function for manual setup
export function initFlutedGlass(
	container: HTMLElement
): FlutedGlassSketch | null {
	const hasImage = container.querySelector("[tlg-fluted-glass-image]");
	const hasVideo = container.querySelector("[tlg-fluted-glass-video]");

	if (hasImage || hasVideo) {
		return new FlutedGlassSketch({
			dom: container,
		});
	} else {
		console.error(
			"No [tlg-fluted-glass-image] or [tlg-fluted-glass-video] child found within container element."
		);
		return null;
	}
}

// Auto-initialize on DOM ready (for attribute-based usage)
export function autoInitFlutedGlass(): void {
	document.querySelectorAll("[tlg-fluted-glass-canvas]").forEach((element) => {
		initFlutedGlass(element as HTMLElement);
	});
}

// Export the class for advanced usage
export { FlutedGlassSketch };
