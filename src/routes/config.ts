/**
 * Centralized route configuration for the application.
 * This file defines all routes in a single location to improve maintainability
 * and provide type safety for navigation.
 */

// Base route configuration
export const ROUTES = {
	// Root routes
	home: "/",

	// Info routes
	roadmap: "/roadmap",

	// Legal routes
	privacyPolicy: "/privacy-policy",
	termsAndConditions: "/terms-and-conditions",

	// Game routes
	games: {
		bo1: {
			base: "/bo1",
			maps: {
				moon: "/bo1/moon",
			},
		},
		bo3: {
			base: "/bo3",
			maps: {
				gorodKrovi: "/bo3/gorod-krovi",
				shadowsOfEvil: "/bo3/shadows-of-evil",
			},
		},
		bo4: {
			base: "/bo4",
			maps: {
				voyageOfDespair: "/bo4/voyage-of-despair",
				tagDerToten: "/bo4/tag-der-toten",
				bloodOfTheDead: "/bo4/blood-of-the-dead",
				ix: "/bo4/ix",
				classified: "/bo4/classified",
				deadOfTheNight: "/bo4/dead-of-the-night",
				alphaOmega: "/bo4/alpha-omega",
				ancientEvil: "/bo4/ancient-evil",
			},
		},
		bo5: {
			base: "/bo5",
			maps: {
				firebaseZ: "/bo5/firebase-z",
				mauerDerToten: "/bo5/mauer-der-toten",
			},
		},
		bo6: {
			base: "/bo6",
			maps: {
				terminus: "/bo6/terminus",
				libertyFalls: "/bo6/liberty-falls",
				citadelleDesMorts: "/bo6/citadelle-des-morts",
				theTomb: "/bo6/the-tomb",
				shatteredVeil: "/bo6/shattered-veil",
				reckoning: "/bo6/reckoning",
			},
		},
		bo7: {
			base: "/bo7",
			maps: {
				ashesOfTheDamned: "/bo7/ashes-of-the-damned",
				astraMalorum: "/bo7/astra-malorum",
			},
		},
	},
} as const;

// Map step routes configuration
export const MAP_STEPS = {
	bo1: {
		moon: {
			base: "/bo1/moon",
			steps: {
				samanthaSays: "/bo1/moon/samantha-says",
			},
		},
	},
	bo3: {
		gorodKrovi: {
			base: "/bo3/gorod-krovi",
			steps: {
				valves: "/bo3/gorod-krovi/valves",
			},
		},
		shadowsOfEvil: {
			base: "/bo3/shadows-of-evil",
			steps: {
				eggSymbols: "/bo3/shadows-of-evil/egg-symbols",
			},
		},
	},
	bo4: {
		voyageOfDespair: {
			base: "/bo4/voyage-of-despair",
			steps: {
				clock: "/bo4/voyage-of-despair/clock",
				outlet: "/bo4/voyage-of-despair/outlet",
				planet: "/bo4/voyage-of-despair/planet",
			},
		},
		tagDerToten: {
			base: "/bo4/tag-der-toten",
			steps: {
				totems: "/bo4/tag-der-toten/totems",
				apothican: "/bo4/tag-der-toten/apothican",
				orbs: "/bo4/tag-der-toten/orbs",
				seal: "/bo4/tag-der-toten/seal",
			},
		},
		alphaOmega: {
			base: "/bo4/alpha-omega",
			steps: {
				unlockAdam: "/bo4/alpha-omega/unlock-adam",
				clocks: "/bo4/alpha-omega/clocks",
				coreValue3: "/bo4/alpha-omega/core-value-3",
				coreValue4: "/bo4/alpha-omega/core-value-4",
			},
		},
		classified: {
			base: "/bo4/classified",
			steps: {
				codes: "/bo4/classified/codes",
			},
		},
		deadOfTheNight: {
			base: "/bo4/dead-of-the-night",
			steps: {
				alastairFolly: "/bo4/dead-of-the-night/alastair-folly",
				atlas: "/bo4/dead-of-the-night/atlas",
				scratches: "/bo4/dead-of-the-night/scratches",
			},
		},
		ix: {
			base: "/bo4/ix",
			steps: {
				raSymbols: "/bo4/ix/ra-symbols",
			},
		},
		bloodOfTheDead: {
			base: "/bo4/blood-of-the-dead",
			steps: {
				powerHouse: "/bo4/blood-of-the-dead/power-house",
			},
		},
	},
	bo5: {
		firebaseZ: {
			base: "/bo5/firebase-z",
			steps: {
				dartboard: "/bo5/firebase-z/dartboard",
			},
		},
		mauerDerToten: {
			base: "/bo5/mauer-der-toten",
			steps: {
				"safe-code": "/bo5/mauer-der-toten/safe-code",
			},
		},
	},
	bo6: {
		terminus: {
			base: "/bo6/terminus",
			steps: {
				nathan: "/bo6/terminus/nathan",
				beam: "/bo6/terminus/beam",
			},
		},
		libertyFalls: {
			base: "/bo6/liberty-falls",
			steps: {
				vault: "/bo6/liberty-falls/vault",
			},
		},
		shatteredVeil: {
			base: "/bo6/shattered-veil",
			steps: {
				chalkboard: "/bo6/shattered-veil/chalkboard",
				safe: "/bo6/shattered-veil/safe",
			},
		},
		citadelleDesMorts: {
			base: "/bo6/citadelle-des-morts",
			steps: {
				ravenSword: "/bo6/citadelle-des-morts/raven-sword",
				traps: "/bo6/citadelle-des-morts/traps",
			},
		},
		reckoning: {
			base: "/bo6/reckoning",
			steps: {
				documents: "/bo6/reckoning/documents",
				door: "/bo6/reckoning/door",
			},
		},
		theTomb: {
			base: "/bo6/the-tomb",
			steps: {
				staffUpgrade: "/bo6/the-tomb/staff-upgrade",
			},
		},
	},
	bo7: {
		ashesOfTheDamned: {
			base: "/bo7/ashes-of-the-damned",
			steps: {
				serum: "/bo7/ashes-of-the-damned/serum",
				rocketLaunch: "/bo7/ashes-of-the-damned/rocket-launch",
			},
		},
		astraMalorum: {
			base: "/bo7/astra-malorum",
			steps: {
				oscarCode: "/bo7/astra-malorum/oscar-code",
			},
		},
	},
} as const;

// Route patterns for React Router (with wildcards)
export const ROUTE_PATTERNS = {
	games: {
		bo1: {
			base: "/bo1",
			maps: {
				moon: "/bo1/moon/*",
			},
		},
		bo3: {
			base: "/bo3",
			maps: {
				gorodKrovi: "/bo3/gorod-krovi/*",
				shadowsOfEvil: "/bo3/shadows-of-evil/*",
			},
		},
		bo4: {
			base: "/bo4",
			maps: {
				voyageOfDespair: "/bo4/voyage-of-despair/*",
				tagDerToten: "/bo4/tag-der-toten/*",
				bloodOfTheDead: "/bo4/blood-of-the-dead/*",
				ix: "/bo4/ix/*",
				classified: "/bo4/classified/*",
				deadOfTheNight: "/bo4/dead-of-the-night/*",
				alphaOmega: "/bo4/alpha-omega/*",
				ancientEvil: "/bo4/ancient-evil/*",
			},
		},
		bo5: {
			base: "/bo5",
			maps: {
				firebaseZ: "/bo5/firebase-z/*",
				mauerDerToten: "/bo5/mauer-der-toten/*",
			},
		},
		bo6: {
			base: "/bo6",
			maps: {
				terminus: "/bo6/terminus/*",
				libertyFalls: "/bo6/liberty-falls/*",
				citadelleDesMorts: "/bo6/citadelle-des-morts/*",
				theTomb: "/bo6/the-tomb/*",
				shatteredVeil: "/bo6/shattered-veil/*",
				reckoning: "/bo6/reckoning/*",
			},
		},
		bo7: {
			base: "/bo7",
			maps: {
				ashesOfTheDamned: "/bo7/ashes-of-the-damned/*",
				astraMalorum: "/bo7/astra-malorum/*",
			},
		},
	},
} as const;

// Map metadata that corresponds to routes
export const ROUTE_METADATA = {
	"/": {
		title: "COD Zombies Tools",
		documentTitle:
			"COD Zombies Tools - Easter Egg Solver for BO1 | BO3 | BO4 | BO6 | BO7",
	},
	[ROUTES.roadmap]: {
		title: "Development Roadmap",
		documentTitle: "Development Roadmap - COD Zombies Tools",
	},
	[ROUTES.privacyPolicy]: {
		title: "Privacy Policy",
		documentTitle: "Privacy Policy - COD Zombies Tools",
	},
	[ROUTES.termsAndConditions]: {
		title: "Terms and Conditions",
		documentTitle: "Terms and Conditions - COD Zombies Tools",
	},
	"/bo1": {
		title: "Black Ops 1 - Select Map",
		documentTitle: "BO1 Maps - COD Zombies Tools",
	},
	"/bo3": {
		title: "Black Ops 3 - Select Map",
		documentTitle: "BO3 Maps - COD Zombies Tools",
	},
	"/bo4": {
		title: "Black Ops 4 - Select Map",
		documentTitle: "BO4 Maps - COD Zombies Tools",
	},
	"/bo5": {
		title: "Cold War - Select Map",
		documentTitle: "CW Maps - COD Zombies Tools",
	},
	"/bo6": {
		title: "Black Ops 6 - Select Map",
		documentTitle: "BO6 Maps - COD Zombies Tools",
	},
	"/bo7": {
		title: "Black Ops 7 - Select Map",
		documentTitle: "BO7 Maps - COD Zombies Tools",
	},
	[ROUTES.games.bo1.maps.moon]: {
		title: "Moon",
		documentTitle: "Moon Easter Eggs - COD Zombies Tools",
	},
	[ROUTES.games.bo3.maps.gorodKrovi]: {
		title: "Gorod Krovi",
		documentTitle: "Gorod Krovi Easter Eggs - COD Zombies Tools",
	},
	[ROUTES.games.bo3.maps.shadowsOfEvil]: {
		title: "Shadows of Evil",
		documentTitle: "Shadows of Evil Easter Eggs - COD Zombies Tools",
	},
	[ROUTES.games.bo4.maps.ix]: {
		title: "IX",
		documentTitle: "IX Easter Eggs - COD Zombies Tools",
	},
	[ROUTES.games.bo4.maps.voyageOfDespair]: {
		title: "Voyage of Despair",
		documentTitle: "Voyage of Despair Easter Eggs - COD Zombies Tools",
	},
	[ROUTES.games.bo4.maps.tagDerToten]: {
		title: "Tag der Toten",
		documentTitle: "Tag der Toten Easter Eggs - COD Zombies Tools",
	},
	[ROUTES.games.bo4.maps.alphaOmega]: {
		title: "Alpha Omega",
		documentTitle: "Alpha Omega Easter Eggs - COD Zombies Tools",
	},
	[ROUTES.games.bo4.maps.classified]: {
		title: "Classified",
		documentTitle: "Classified Easter Eggs - COD Zombies Tools",
	},
	[ROUTES.games.bo4.maps.deadOfTheNight]: {
		title: "Dead of the Night",
		documentTitle: "Dead of the Night Easter Eggs - COD Zombies Tools",
	},
	[ROUTES.games.bo5.maps.mauerDerToten]: {
		title: "Mauer der Toten",
		documentTitle: "Mauer der Toten Easter Eggs - COD Zombies Tools",
	},
	[ROUTES.games.bo6.maps.terminus]: {
		title: "Terminus",
		documentTitle: "Terminus Easter Eggs - COD Zombies Tools",
	},
	[ROUTES.games.bo6.maps.libertyFalls]: {
		title: "Liberty Falls",
		documentTitle: "Liberty Falls Easter Eggs - COD Zombies Tools",
	},
	[ROUTES.games.bo6.maps.citadelleDesMorts]: {
		title: "Citadelle des Morts",
		documentTitle: "Citadelle des Morts Easter Eggs - COD Zombies Tools",
	},
	[ROUTES.games.bo6.maps.theTomb]: {
		title: "The Tomb",
		documentTitle: "The Tomb Easter Eggs - COD Zombies Tools",
	},
	[ROUTES.games.bo6.maps.shatteredVeil]: {
		title: "Shattered Veil",
		documentTitle: "Shattered Veil Easter Eggs - COD Zombies Tools",
	},
	[ROUTES.games.bo6.maps.reckoning]: {
		title: "Reckoning",
		documentTitle: "Reckoning Easter Eggs - COD Zombies Tools",
	},
	[ROUTES.games.bo7.maps.ashesOfTheDamned]: {
		title: "Ashes of the Damned",
		documentTitle: "Ashes of the Damned Easter Eggs - COD Zombies Tools",
	},
} as const;

// Type exports for TypeScript support
export type RouteConfig = typeof ROUTES;
export type MapStepsConfig = typeof MAP_STEPS;
export type RoutePatterns = typeof ROUTE_PATTERNS;
export type RouteMetadata = typeof ROUTE_METADATA;

// Helper type for extracting route paths
export type RoutePaths =
	| typeof ROUTES.home
	| typeof ROUTES.games.bo1.base
	| typeof ROUTES.games.bo3.base
	| typeof ROUTES.games.bo4.base
	| typeof ROUTES.games.bo5.base
	| typeof ROUTES.games.bo6.base
	| typeof ROUTES.games.bo7.base
	| (typeof ROUTES.games.bo1.maps)[keyof typeof ROUTES.games.bo1.maps]
	| (typeof ROUTES.games.bo3.maps)[keyof typeof ROUTES.games.bo3.maps]
	| (typeof ROUTES.games.bo4.maps)[keyof typeof ROUTES.games.bo4.maps]
	| (typeof ROUTES.games.bo5.maps)[keyof typeof ROUTES.games.bo5.maps]
	| (typeof ROUTES.games.bo6.maps)[keyof typeof ROUTES.games.bo6.maps]
	| (typeof ROUTES.games.bo7.maps)[keyof typeof ROUTES.games.bo7.maps];
