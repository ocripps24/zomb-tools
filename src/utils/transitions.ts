/**
 * Centralized transition configuration for Framer Motion animations
 *
 * This file provides consistent animation settings across the application.
 * Modify these values to change transition behavior globally.
 */

import { Transition, Variants } from "framer-motion";

// Base transition configurations
export const TRANSITIONS = {
	// Page-level transitions (route changes)
	page: {
		duration: 0.25,
		ease: "easeInOut",
	} as Transition,

	// Map section transitions (within maps)
	section: {
		duration: 0.25,
		ease: "easeInOut",
	} as Transition,

	// Quick transitions for UI elements
	quick: {
		duration: 0.15,
		ease: "easeOut",
	} as Transition,

	// Slow transitions for emphasis
	slow: {
		duration: 0.5,
		ease: "easeInOut",
	} as Transition,
} as const;

// Animation variants for different effects
export const ANIMATION_VARIANTS = {
	// Simple fade in/out
	fade: {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	} as Variants,

	// Slide from right
	slideRight: {
		initial: { opacity: 0, x: 20 },
		animate: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: -20 },
	} as Variants,

	// Slide from left
	slideLeft: {
		initial: { opacity: 0, x: -20 },
		animate: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: 20 },
	} as Variants,

	// Scale + fade
	scale: {
		initial: { opacity: 0, scale: 0.95 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.95 },
	} as Variants,

	// Slide up from bottom
	slideUp: {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -20 },
	} as Variants,
} as const;

// Pre-configured animation props for common use cases
export const PAGE_TRANSITION = {
	variants: ANIMATION_VARIANTS.fade,
	transition: TRANSITIONS.page,
	initial: "initial",
	animate: "animate",
	exit: "exit",
} as const;

export const SECTION_TRANSITION = {
	variants: ANIMATION_VARIANTS.fade,
	transition: TRANSITIONS.section,
	initial: "initial",
	animate: "animate",
	exit: "exit",
} as const;

// Helper function to create custom transitions
export const createTransition = (
	variant: keyof typeof ANIMATION_VARIANTS,
	transition: keyof typeof TRANSITIONS = "page"
) => ({
	variants: ANIMATION_VARIANTS[variant],
	transition: TRANSITIONS[transition],
	initial: "initial",
	animate: "animate",
	exit: "exit",
});
