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

	// Dashboard routes
	dashboard: {
		base: "/dashboard",
		new: "/dashboard/new",
		view: (id: string) => `/dashboard/${id}`,
		edit: (id: string) => `/dashboard/${id}/edit`,
		share: (encodedData: string) => `/dashboard/share/${encodedData}`,
	},

	// Game routes
	games: {
		bo1: {
			base: "/bo1",
			maps: {
				moon: "/bo1/moon",
			},
		},
		bo2: {
			base: "/bo2",
			maps: {
				dieRise: "/bo2/die-rise",
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
				paradoxJunction: "/bo7/paradox-junction",
				totenreich: "/bo7/totenreich",
				kowakujo: "/bo7/kowakujo",
			},
		},
		iw: {
			base: "/iw",
			maps: {
				shaolinShuffle: "/iw/shaolin-shuffle",
				attackOfTheRadioactiveThing: "/iw/attack-of-the-radioactive-thing",
				beastFromBeyond: "/iw/beast-from-beyond",
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
	bo2: {
		dieRise: {
			base: "/bo2/die-rise",
			steps: {
				mahjongTiles: "/bo2/die-rise/mahjong-tiles",
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
				morseCode: "/bo4/blood-of-the-dead/morse-code",
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
				gauntlet: "/bo7/ashes-of-the-damned/gauntlet",
				serum: "/bo7/ashes-of-the-damned/serum",
				rocketLaunch: "/bo7/ashes-of-the-damned/rocket-launch",
			},
		},
		astraMalorum: {
			base: "/bo7/astra-malorum",
			steps: {
				oscarCode: "/bo7/astra-malorum/oscar-code",
				books: "/bo7/astra-malorum/books",
				teleporter: "/bo7/astra-malorum/teleporter",
				organ: "/bo7/astra-malorum/organ",
			},
		},
		paradoxJunction: {
			base: "/bo7/paradox-junction",
			steps: {
				pianoNotes: "/bo7/paradox-junction/piano-notes",
			},
		},
		totenreich: {
			base: "/bo7/totenreich",
			steps: {
				aaBullet: "/bo7/totenreich/aa-bullet",
				wunderbarrage: "/bo7/totenreich/wunderbarrage",
				clawMachine: "/bo7/totenreich/claw-machine",
			},
		},
		kowakujo: {
			base: "/bo7/kowakujo",
			steps: {
				masks: "/bo7/kowakujo/masks",
				scrolls: "/bo7/kowakujo/scrolls",
				murderMystery: "/bo7/kowakujo/murder-mystery",
				flags: "/bo7/kowakujo/flags",
			},
		},
	},
	iw: {
		shaolinShuffle: {
			base: "/iw/shaolin-shuffle",
			steps: {
				morseCode: "/iw/shaolin-shuffle/morse-code",
				rooftopSymbols: "/iw/shaolin-shuffle/rooftop-symbols",
			},
		},
		attackOfTheRadioactiveThing: {
			base: "/iw/attack-of-the-radioactive-thing",
			steps: {
				codes: "/iw/attack-of-the-radioactive-thing/codes",
				chemistryData: "/iw/attack-of-the-radioactive-thing/chemistry-data",
				chemistryCrafting:
					"/iw/attack-of-the-radioactive-thing/chemistry-crafting",
			},
		},
		beastFromBeyond: {
			base: "/iw/beast-from-beyond",
			steps: {
				disks: "/iw/beast-from-beyond/disks",
				neilHack: "/iw/beast-from-beyond/neil-hack",
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
		bo2: {
			base: "/bo2",
			maps: {
				dieRise: "/bo2/die-rise/*",
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
				paradoxJunction: "/bo7/paradox-junction/*",
				totenreich: "/bo7/totenreich/*",
				kowakujo: "/bo7/kowakujo/*",
			},
		},
		iw: {
			base: "/iw",
			maps: {
				shaolinShuffle: "/iw/shaolin-shuffle/*",
				attackOfTheRadioactiveThing: "/iw/attack-of-the-radioactive-thing/*",
				beastFromBeyond: "/iw/beast-from-beyond/*",
			},
		},
	},
} as const;

// Map metadata that corresponds to routes
export const ROUTE_METADATA = {
	"/": {
		title: "COD Zombies Tools",
		documentTitle: "COD Zombies Tools - Easter Egg Solvers & Speedrun Tools",
		description:
			"Interactive Easter Egg solvers and speedrun tools covering BO1-BO7 and IW zombies. Track codes, steps, and progress.",
	},
	[ROUTES.roadmap]: {
		title: "Development Roadmap",
		documentTitle: "Development Roadmap - COD Zombies Tools",
		description:
			"See what's coming next for COD Zombies Tools — upcoming maps, features, and fixes on the development roadmap.",
	},
	[ROUTES.privacyPolicy]: {
		title: "Privacy Policy",
		documentTitle: "Privacy Policy - COD Zombies Tools",
		description:
			"Privacy Policy for COD Zombies Tools, covering how your data and locally saved progress are handled.",
	},
	[ROUTES.termsAndConditions]: {
		title: "Terms and Conditions",
		documentTitle: "Terms and Conditions - COD Zombies Tools",
		description: "Terms and Conditions for using COD Zombies Tools.",
	},
	"/bo1": {
		title: "Black Ops 1 - Select Map",
		documentTitle: "BO1 Maps - COD Zombies Tools",
		description:
			"Choose a Black Ops 1 Zombies map to open its Easter Egg solver and speedrun tools.",
	},
	"/bo2": {
		title: "Black Ops 2 - Select Map",
		documentTitle: "BO2 Maps - COD Zombies Tools",
		description:
			"Choose a Black Ops 2 Zombies map to open its Easter Egg solver and speedrun tools.",
	},
	"/bo3": {
		title: "Black Ops 3 - Select Map",
		documentTitle: "BO3 Maps - COD Zombies Tools",
		description:
			"Choose a Black Ops 3 Zombies map to open its Easter Egg solver and speedrun tools.",
	},
	"/bo4": {
		title: "Black Ops 4 - Select Map",
		documentTitle: "BO4 Maps - COD Zombies Tools",
		description:
			"Choose a Black Ops 4 Zombies map to open its Easter Egg solver and speedrun tools.",
	},
	"/bo5": {
		title: "Cold War - Select Map",
		documentTitle: "CW Maps - COD Zombies Tools",
		description:
			"Choose a Black Ops Cold War Zombies map to open its Easter Egg solver and speedrun tools.",
	},
	"/bo6": {
		title: "Black Ops 6 - Select Map",
		documentTitle: "BO6 Maps - COD Zombies Tools",
		description:
			"Choose a Black Ops 6 Zombies map to open its Easter Egg solver and speedrun tools.",
	},
	"/bo7": {
		title: "Black Ops 7 - Select Map",
		documentTitle: "BO7 Maps - COD Zombies Tools",
		description:
			"Choose a Black Ops 7 Zombies map to open its Easter Egg solver and speedrun tools.",
	},
	[ROUTES.games.bo1.maps.moon]: {
		title: "Moon",
		documentTitle: "Moon Easter Eggs - COD Zombies Tools",
		description:
			"Moon (Black Ops 1) Easter Egg walkthrough — Samantha Says steps, codes, and progress tracking.",
	},
	[ROUTES.games.bo2.maps.dieRise]: {
		title: "Die Rise",
		documentTitle: "Die Rise Easter Eggs - COD Zombies Tools",
		description:
			"Die Rise (Black Ops 2) Easter Egg walkthrough — Mahjong Tiles steps, codes, and progress tracking.",
	},
	[ROUTES.games.bo3.maps.gorodKrovi]: {
		title: "Gorod Krovi",
		documentTitle: "Gorod Krovi Easter Eggs - COD Zombies Tools",
		description:
			"Gorod Krovi (Black Ops 3) Easter Egg walkthrough — valve steps, codes, and progress tracking.",
	},
	[ROUTES.games.bo3.maps.shadowsOfEvil]: {
		title: "Shadows of Evil",
		documentTitle: "Shadows of Evil Easter Eggs - COD Zombies Tools",
		description:
			"Shadows of Evil (Black Ops 3) Easter Egg walkthrough — egg symbol steps, codes, and progress tracking.",
	},
	[ROUTES.games.bo4.maps.ix]: {
		title: "IX",
		documentTitle: "IX Easter Eggs - COD Zombies Tools",
		description:
			"IX (Black Ops 4) Easter Egg walkthrough — Ra symbol steps, codes, and progress tracking.",
	},
	[ROUTES.games.bo4.maps.voyageOfDespair]: {
		title: "Voyage of Despair",
		documentTitle: "Voyage of Despair Easter Eggs - COD Zombies Tools",
		description:
			"Voyage of Despair (Black Ops 4) Easter Egg walkthrough — clock, outlet, and planet steps, codes, and progress tracking.",
	},
	[ROUTES.games.bo4.maps.tagDerToten]: {
		title: "Tag der Toten",
		documentTitle: "Tag der Toten Easter Eggs - COD Zombies Tools",
		description:
			"Tag der Toten (Black Ops 4) Easter Egg walkthrough — totems, apothicons, orbs, and seal steps, codes, and progress tracking.",
	},
	[ROUTES.games.bo4.maps.alphaOmega]: {
		title: "Alpha Omega",
		documentTitle: "Alpha Omega Easter Eggs - COD Zombies Tools",
		description:
			"Alpha Omega (Black Ops 4) Easter Egg walkthrough — Adam unlock, clocks, and core value steps, codes, and progress tracking.",
	},
	[ROUTES.games.bo4.maps.classified]: {
		title: "Classified",
		documentTitle: "Classified Easter Eggs - COD Zombies Tools",
		description:
			"Classified (Black Ops 4) Easter Egg walkthrough — code solver and progress tracking.",
	},
	[ROUTES.games.bo4.maps.deadOfTheNight]: {
		title: "Dead of the Night",
		documentTitle: "Dead of the Night Easter Eggs - COD Zombies Tools",
		description:
			"Dead of the Night (Black Ops 4) Easter Egg walkthrough — Alastair Folly, Atlas, and scratches steps, codes, and progress tracking.",
	},
	[ROUTES.games.bo4.maps.bloodOfTheDead]: {
		title: "Blood of the Dead",
		documentTitle: "Blood of the Dead Easter Eggs - COD Zombies Tools",
		description:
			"Blood of the Dead (Black Ops 4) Easter Egg walkthrough — power house and Morse code steps, and progress tracking.",
	},
	[ROUTES.games.bo5.maps.firebaseZ]: {
		title: "Firebase Z",
		documentTitle: "Firebase Z Easter Eggs - COD Zombies Tools",
		description:
			"Firebase Z (Black Ops Cold War) Easter Egg walkthrough — dartboard steps, codes, and progress tracking.",
	},
	[ROUTES.games.bo5.maps.mauerDerToten]: {
		title: "Mauer der Toten",
		documentTitle: "Mauer der Toten Easter Eggs - COD Zombies Tools",
		description:
			"Mauer der Toten (Black Ops Cold War) Easter Egg walkthrough — safe code steps and progress tracking.",
	},
	[ROUTES.games.bo6.maps.terminus]: {
		title: "Terminus",
		documentTitle: "Terminus Easter Eggs - COD Zombies Tools",
		description:
			"Terminus (Black Ops 6) Easter Egg walkthrough — Nathan and beam steps, codes, and progress tracking.",
	},
	[ROUTES.games.bo6.maps.libertyFalls]: {
		title: "Liberty Falls",
		documentTitle: "Liberty Falls Easter Eggs - COD Zombies Tools",
		description:
			"Liberty Falls (Black Ops 6) Easter Egg walkthrough — vault steps, codes, and progress tracking.",
	},
	[ROUTES.games.bo6.maps.citadelleDesMorts]: {
		title: "Citadelle des Morts",
		documentTitle: "Citadelle des Morts Easter Eggs - COD Zombies Tools",
		description:
			"Citadelle des Morts (Black Ops 6) Easter Egg walkthrough — Raven Sword and trap steps, codes, and progress tracking.",
	},
	[ROUTES.games.bo6.maps.theTomb]: {
		title: "The Tomb",
		documentTitle: "The Tomb Easter Eggs - COD Zombies Tools",
		description:
			"The Tomb (Black Ops 6) Easter Egg walkthrough — staff upgrade steps and progress tracking.",
	},
	[ROUTES.games.bo6.maps.shatteredVeil]: {
		title: "Shattered Veil",
		documentTitle: "Shattered Veil Easter Eggs - COD Zombies Tools",
		description:
			"Shattered Veil (Black Ops 6) Easter Egg walkthrough — chalkboard and safe steps, codes, and progress tracking.",
	},
	[ROUTES.games.bo6.maps.reckoning]: {
		title: "Reckoning",
		documentTitle: "Reckoning Easter Eggs - COD Zombies Tools",
		description:
			"Reckoning (Black Ops 6) Easter Egg walkthrough — document and door steps, codes, and progress tracking.",
	},
	[ROUTES.games.bo7.maps.ashesOfTheDamned]: {
		title: "Ashes of the Damned",
		documentTitle: "Ashes of the Damned Easter Eggs - COD Zombies Tools",
		description:
			"Ashes of the Damned (Black Ops 7) Easter Egg walkthrough — serum and rocket launch steps, codes, and progress tracking.",
	},
	[ROUTES.games.bo7.maps.astraMalorum]: {
		title: "Astra Malorum",
		documentTitle: "Astra Malorum Easter Eggs - COD Zombies Tools",
		description:
			"Astra Malorum (Black Ops 7) Easter Egg walkthrough — Oscar code, books, teleporter, and organ steps, codes, and progress tracking.",
	},
	[ROUTES.games.bo7.maps.paradoxJunction]: {
		title: "Paradox Junction",
		documentTitle: "Paradox Junction Easter Eggs - COD Zombies Tools",
		description:
			"Paradox Junction (Black Ops 7) Easter Egg walkthrough — piano notes steps and progress tracking.",
	},
	[ROUTES.games.bo7.maps.totenreich]: {
		title: "Totenreich",
		documentTitle: "Totenreich Easter Eggs - COD Zombies Tools",
		description:
			"Totenreich (Black Ops 7) Easter Egg walkthrough — AA bullet, Wunderbarrage, and claw machine steps, codes, and progress tracking.",
	},
	[ROUTES.games.bo7.maps.kowakujo]: {
		title: "Kowakujo",
		documentTitle: "Kowakujo Easter Eggs - COD Zombies Tools",
		description:
			"Kowakujo (Black Ops 7) Easter Egg walkthrough — masks, scrolls, murder mystery, and flags steps, codes, and progress tracking.",
	},
	"/iw": {
		title: "Infinite Warfare - Select Map",
		documentTitle: "IW Maps - COD Zombies Tools",
		description:
			"Choose an Infinite Warfare Zombies map to open its Easter Egg solver and speedrun tools.",
	},
	[ROUTES.games.iw.maps.shaolinShuffle]: {
		title: "Shaolin Shuffle",
		documentTitle: "Shaolin Shuffle Easter Eggs - COD Zombies Tools",
		description:
			"Shaolin Shuffle (Infinite Warfare) Easter Egg walkthrough — Morse code and rooftop symbol steps, codes, and progress tracking.",
	},
	[ROUTES.games.iw.maps.attackOfTheRadioactiveThing]: {
		title: "Attack of the Radioactive Thing",
		documentTitle:
			"Attack of the Radioactive Thing Easter Eggs - COD Zombies Tools",
		description:
			"Attack of the Radioactive Thing (Infinite Warfare) Easter Egg walkthrough — steps, codes, and progress tracking.",
	},
	[ROUTES.games.iw.maps.beastFromBeyond]: {
		title: "Beast from Beyond",
		documentTitle: "Beast from Beyond Easter Eggs - COD Zombies Tools",
		description:
			"Beast from Beyond (Infinite Warfare) Easter Egg walkthrough — disk steps, codes, and progress tracking.",
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
	| typeof ROUTES.games.bo2.base
	| typeof ROUTES.games.bo3.base
	| typeof ROUTES.games.bo4.base
	| typeof ROUTES.games.bo5.base
	| typeof ROUTES.games.bo6.base
	| typeof ROUTES.games.bo7.base
	| (typeof ROUTES.games.bo1.maps)[keyof typeof ROUTES.games.bo1.maps]
	| (typeof ROUTES.games.bo2.maps)[keyof typeof ROUTES.games.bo2.maps]
	| (typeof ROUTES.games.bo3.maps)[keyof typeof ROUTES.games.bo3.maps]
	| (typeof ROUTES.games.bo4.maps)[keyof typeof ROUTES.games.bo4.maps]
	| (typeof ROUTES.games.bo5.maps)[keyof typeof ROUTES.games.bo5.maps]
	| (typeof ROUTES.games.bo6.maps)[keyof typeof ROUTES.games.bo6.maps]
	| (typeof ROUTES.games.bo7.maps)[keyof typeof ROUTES.games.bo7.maps]
	| (typeof ROUTES.games.iw.maps)[keyof typeof ROUTES.games.iw.maps];
