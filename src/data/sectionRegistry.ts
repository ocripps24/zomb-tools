import type { SectionRegistry, SectionRegistryEntry } from "@/types/dashboard";

// ===== IW Imports =====
// Shaolin Shuffle
import ShaolinMorseCodeSection from "@/components/games/iw/maps/shaolin-shuffle/sections/MorseCodeSection";
import ShaolinRooftopSymbolsSection from "@/components/games/iw/maps/shaolin-shuffle/sections/RooftopSymbolsSection";

// Beast from Beyond
import BeastFromBeyondDisksSection from "@/components/games/iw/maps/beast-from-beyond/sections/DisksSection";
import BeastFromBeyondNeilHackSection from "@/components/games/iw/maps/beast-from-beyond/sections/NeilHackSection";

// Attack of the Radioactive Thing
import AotrtCodesSection from "@/components/games/iw/maps/attack-of-the-radioactive-thing/sections/CodesSection";
import AotrtDataSection from "@/components/games/iw/maps/attack-of-the-radioactive-thing/sections/DataSection";
import AotrtChemistrySection from "@/components/games/iw/maps/attack-of-the-radioactive-thing/sections/ChemistrySection";

// ===== BO7 Imports =====
// Astra Malorum
import AstraPapCodeSection from "@/components/games/bo7/maps/astra-malorum/sections/PapCodeSection";
import AstraBooksSection from "@/components/games/bo7/maps/astra-malorum/sections/BooksSection";
import AstraTeleporterSection from "@/components/games/bo7/maps/astra-malorum/sections/TeleporterSection";
import AstraOrganSection from "@/components/games/bo7/maps/astra-malorum/sections/OrganSection";

// Ashes of the Damned
import AshesGauntletSection from "@/components/games/bo7/maps/ashes-of-the-damned/sections/GauntletSection";
import AshesRocketLaunchSection from "@/components/games/bo7/maps/ashes-of-the-damned/sections/RocketLaunchSection";
import AshesSerumSection from "@/components/games/bo7/maps/ashes-of-the-damned/sections/SerumSection";

// Totenreich
import TotenreichAABulletSection from "@/components/games/bo7/maps/totenreich/sections/AABulletSection";
import TotenreichClawMachineSection from "@/components/games/bo7/maps/totenreich/sections/ClawMachineSection";
import TotenreichWunderbarageSection from "@/components/games/bo7/maps/totenreich/sections/WunderbarageSection";

// Kowakujo
import KowakujoMasksSection from "@/components/games/bo7/maps/kowakujo/sections/MasksSection";
import KowakujoScrollsSection from "@/components/games/bo7/maps/kowakujo/sections/ScrollsSection";
import KowakujoFlagsSection from "@/components/games/bo7/maps/kowakujo/sections/FlagsSection";
import KowakujoMurderMysterySection from "@/components/games/bo7/maps/kowakujo/sections/MurderMysterySection";
import RexInfernusDravakarsSanctuarySection from "@/components/games/bo7/maps/rex-infernus/sections/DravakarsSanctuarySection";
import RexInfernusNexusForgeSection from "@/components/games/bo7/maps/rex-infernus/sections/NexusForgeSection";
import RexInfernusHouseSymbolsSection from "@/components/games/bo7/maps/rex-infernus/sections/HouseSymbolsSection";

// Paradox Junction
import ParadoxPianoNotesSection from "@/components/games/bo7/maps/paradox-junction/sections/PianoNotesSection";

// ===== BO6 Imports =====
// Terminus
import TerminusBeamCodeSection from "@/components/games/bo6/maps/terminus/sections/BeamCodeSection";
import TerminusNathanCodeSection from "@/components/games/bo6/maps/terminus/sections/NathanCodeSection";

// Liberty Falls
import LibertyFallsVaultCodeSection from "@/components/games/bo6/maps/liberty-falls/sections/VaultCodeSection";

// Citadelle des Morts
import CitadelleTrapsSection from "@/components/games/bo6/maps/citadelle-des-morts/sections/TrapsSection";
import CitadelleRavenSwordSection from "@/components/games/bo6/maps/citadelle-des-morts/sections/RavenSwordSection";

// Shattered Veil
import ShatteredVeilSafeCodeSection from "@/components/games/bo6/maps/shattered-veil/sections/SafeCodeSection";
import ShatteredVeilChalkboardCodeSection from "@/components/games/bo6/maps/shattered-veil/sections/ChalkboardCodeSection";

// The Tomb
import TheTombStaffUpgrade from "@/components/games/bo6/maps/the-tomb/sections/StaffUpgrade";

// Reckoning
import ReckoningDoorCodeSection from "@/components/games/bo6/maps/reckoning/sections/DoorCodeSection";
import ReckoningDocumentsCodeSection from "@/components/games/bo6/maps/reckoning/sections/DocumentsCodeSection";

// ===== BO5 Imports =====
// Mauer der Toten
import MauerSafeCodeSection from "@/components/games/bo5/maps/mauer-der-toten/sections/SafeCodeSection";

// Firebase Z
import FirebaseZDartboardSection from "@/components/games/bo5/maps/firebase-z/sections/DartboardSection";

// ===== BO4 Imports =====
// Voyage of Despair
import VoyageClockSection from "@/components/games/bo4/maps/voyage-of-despair/sections/ClockSection";
import VoyageOutletSection from "@/components/games/bo4/maps/voyage-of-despair/sections/OutletSection";
import VoyagePlanetSection from "@/components/games/bo4/maps/voyage-of-despair/sections/PlanetSection";

// IX
import IxRaSymbolsSection from "@/components/games/bo4/maps/ix/sections/RaSymbolsSection";

// Blood of the Dead
import BloodPowerHouseSection from "@/components/games/bo4/maps/blood-of-the-dead/sections/PowerHouseSection";
import BloodMorseCodeSection from "@/components/games/bo4/maps/blood-of-the-dead/sections/MorseCodeSection";

// Classified
import ClassifiedCodesSection from "@/components/games/bo4/maps/classified/sections/CodesSection";

// Dead of the Night
import DeadAlastairFollySection from "@/components/games/bo4/maps/dead-of-the-night/sections/AlastairFollySection";
import DeadScratchesSection from "@/components/games/bo4/maps/dead-of-the-night/sections/ScratchesSection";

// Alpha Omega
import AlphaClocksSection from "@/components/games/bo4/maps/alpha-omega/sections/ClocksSection";
import AlphaCoreValue3Section from "@/components/games/bo4/maps/alpha-omega/sections/CoreValue3Section";
import AlphaCoreValue4Section from "@/components/games/bo4/maps/alpha-omega/sections/CoreValue4Section";
import AlphaUnlockAdamSection from "@/components/games/bo4/maps/alpha-omega/sections/UnlockAdamSection";

// Tag der Toten
import TagOrbLocationsSection from "@/components/games/bo4/maps/tag-der-toten/sections/OrbLocationsSection";
import TagSealOfDualitySection from "@/components/games/bo4/maps/tag-der-toten/sections/SealOfDualitySection";
import TagTotemsSection from "@/components/games/bo4/maps/tag-der-toten/sections/TotemsSection";
import TagApothicanOfferingsSection from "@/components/games/bo4/maps/tag-der-toten/sections/ApothicanOfferingsSection";

// ===== BO3 Imports =====
// Der Eisendrache
import DerEisendracheSimonSaysSection from "@/components/games/bo3/maps/der-eisendrache/sections/SimonSaysSection";

// Gorod Krovi
import GorodKroviValvesSection from "@/components/games/bo3/maps/gorod-krovi/sections/ValvesSection";
import GorodKroviBombsSection from "@/components/games/bo3/maps/gorod-krovi/sections/BombsSection";

// Revelations
import RevelationsKronoriumSection from "@/components/games/bo3/maps/revelations/sections/KronoriumSection";

// Shadows of Evil
import ShadowsEggSymbols from "@/components/games/bo3/maps/shadows-of-evil/sections/EggSymbols";

// ===== BO2 Imports =====
// Die Rise
import DieRiseMahjongTilesSection from "@/components/games/bo2/maps/die-rise/sections/MahjongTilesSection";

// ===== BO1 Imports =====
// Moon
import MoonSamanthaSays from "@/components/games/bo1/maps/moon/sections/SamanthaSays";

/**
 * Central registry of all available sections across all games and maps.
 * This allows the dashboard system to dynamically load and render sections.
 *
 * Structure: gameId -> mapId -> sectionId -> SectionRegistryEntry
 */
export const SECTION_REGISTRY: SectionRegistry = {
	iw: {
		"shaolin-shuffle": {
			"morse-code": {
				id: "morse-code",
				name: "Morse Code",
				component: ShaolinMorseCodeSection,
				gameId: "iw",
				gameName: "Infinite Warfare",
				mapId: "shaolin-shuffle",
				mapName: "Shaolin Shuffle",
			},
			"rooftop-symbols": {
				id: "rooftop-symbols",
				name: "Rooftop Symbols",
				component: ShaolinRooftopSymbolsSection,
				gameId: "iw",
				gameName: "Infinite Warfare",
				mapId: "shaolin-shuffle",
				mapName: "Shaolin Shuffle",
			},
		},
		"beast-from-beyond": {
			disks: {
				id: "disks",
				name: "Disks",
				component: BeastFromBeyondDisksSection,
				gameId: "iw",
				gameName: "Infinite Warfare",
				mapId: "beast-from-beyond",
				mapName: "Beast from Beyond",
			},
			"neil-hack": {
				id: "neil-hack",
				name: "Neil Hack",
				component: BeastFromBeyondNeilHackSection,
				gameId: "iw",
				gameName: "Infinite Warfare",
				mapId: "beast-from-beyond",
				mapName: "Beast from Beyond",
			},
		},
		"attack-of-the-radioactive-thing": {
			codes: {
				id: "codes",
				name: "Codes",
				component: AotrtCodesSection,
				gameId: "iw",
				gameName: "Infinite Warfare",
				mapId: "attack-of-the-radioactive-thing",
				mapName: "Attack of the Radioactive Thing",
			},
			"chemistry-data": {
				id: "chemistry-data",
				name: "Chemistry - Data",
				component: AotrtDataSection,
				gameId: "iw",
				gameName: "Infinite Warfare",
				mapId: "attack-of-the-radioactive-thing",
				mapName: "Attack of the Radioactive Thing",
			},
			"chemistry-crafting": {
				id: "chemistry-crafting",
				name: "Chemistry - Crafting",
				component: AotrtChemistrySection,
				gameId: "iw",
				gameName: "Infinite Warfare",
				mapId: "attack-of-the-radioactive-thing",
				mapName: "Attack of the Radioactive Thing",
			},
		},
	},
	bo7: {
		totenreich: {
			"aa-bullet": {
				id: "aa-bullet",
				name: "AA Bullet",
				component: TotenreichAABulletSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "totenreich",
				mapName: "Totenreich",
			},
			"claw-machine": {
				id: "claw-machine",
				name: "Claw Machine",
				component: TotenreichClawMachineSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "totenreich",
				mapName: "Totenreich",
			},
			wunderbarage: {
				id: "wunderbarage",
				name: "Wunderbarage",
				component: TotenreichWunderbarageSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "totenreich",
				mapName: "Totenreich",
			},
		},
		kowakujo: {
			masks: {
				id: "masks",
				name: "Masks",
				component: KowakujoMasksSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "kowakujo",
				mapName: "Kowakujo",
			},
			scrolls: {
				id: "scrolls",
				name: "Scrolls",
				component: KowakujoScrollsSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "kowakujo",
				mapName: "Kowakujo",
			},
			flags: {
				id: "flags",
				name: "Flags",
				component: KowakujoFlagsSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "kowakujo",
				mapName: "Kowakujo",
			},
			"murder-mystery": {
				id: "murder-mystery",
				name: "Evidence Solver",
				component: KowakujoMurderMysterySection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "kowakujo",
				mapName: "Kowakujo",
			},
		},
		"ashes-of-the-damned": {
			gauntlet: {
				id: "gauntlet",
				name: "Gauntlet",
				component: AshesGauntletSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "ashes-of-the-damned",
				mapName: "Ashes of the Damned",
			},
			"rocket-launch": {
				id: "rocket-launch",
				name: "Rocket Launch",
				component: AshesRocketLaunchSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "ashes-of-the-damned",
				mapName: "Ashes of the Damned",
			},
			serum: {
				id: "serum",
				name: "Serum",
				component: AshesSerumSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "ashes-of-the-damned",
				mapName: "Ashes of the Damned",
			},
		},
		"paradox-junction": {
			"piano-notes": {
				id: "piano-notes",
				name: "Piano Notes",
				component: ParadoxPianoNotesSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "paradox-junction",
				mapName: "Paradox Junction",
			},
		},
		"astra-malorum": {
			"pap-code": {
				id: "pap-code",
				name: "OSCAR Code",
				component: AstraPapCodeSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "astra-malorum",
				mapName: "Astra Malorum",
			},
			books: {
				id: "books",
				name: "Books",
				component: AstraBooksSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "astra-malorum",
				mapName: "Astra Malorum",
			},
			teleporter: {
				id: "teleporter",
				name: "Teleporter",
				component: AstraTeleporterSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "astra-malorum",
				mapName: "Astra Malorum",
			},
			organ: {
				id: "organ",
				name: "Organ / Mars",
				component: AstraOrganSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "astra-malorum",
				mapName: "Astra Malorum",
			},
		},
		"rex-infernus": {
			"dravakars-sanctuary": {
				id: "dravakars-sanctuary",
				name: "Dravakar's Sanctuary",
				component: RexInfernusDravakarsSanctuarySection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "rex-infernus",
				mapName: "Rex Infernus",
			},
			"house-symbols": {
				id: "house-symbols",
				name: "House Symbols",
				component: RexInfernusHouseSymbolsSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "rex-infernus",
				mapName: "Rex Infernus",
			},
			"nexus-forge": {
				id: "nexus-forge",
				name: "Nexus Forge",
				component: RexInfernusNexusForgeSection,
				gameId: "bo7",
				gameName: "Black Ops 7",
				mapId: "rex-infernus",
				mapName: "Rex Infernus",
			},
		},
	},
	bo6: {
		terminus: {
			"beam-code": {
				id: "beam-code",
				name: "Beam Code",
				component: TerminusBeamCodeSection,
				gameId: "bo6",
				gameName: "Black Ops 6",
				mapId: "terminus",
				mapName: "Terminus",
			},
			"nathan-code": {
				id: "nathan-code",
				name: "Nathan's Code",
				component: TerminusNathanCodeSection,
				gameId: "bo6",
				gameName: "Black Ops 6",
				mapId: "terminus",
				mapName: "Terminus",
			},
		},
		"liberty-falls": {
			"vault-code": {
				id: "vault-code",
				name: "Vault Code",
				component: LibertyFallsVaultCodeSection,
				gameId: "bo6",
				gameName: "Black Ops 6",
				mapId: "liberty-falls",
				mapName: "Liberty Falls",
			},
		},
		"citadelle-des-morts": {
			traps: {
				id: "traps",
				name: "Traps",
				component: CitadelleTrapsSection,
				gameId: "bo6",
				gameName: "Black Ops 6",
				mapId: "citadelle-des-morts",
				mapName: "Citadelle des Morts",
			},
			"raven-sword": {
				id: "raven-sword",
				name: "Raven Sword",
				component: CitadelleRavenSwordSection,
				gameId: "bo6",
				gameName: "Black Ops 6",
				mapId: "citadelle-des-morts",
				mapName: "Citadelle des Morts",
			},
		},
		"the-tomb": {
			"staff-upgrade": {
				id: "staff-upgrade",
				name: "Staff Upgrade",
				component: TheTombStaffUpgrade,
				gameId: "bo6",
				gameName: "Black Ops 6",
				mapId: "the-tomb",
				mapName: "The Tomb",
			},
		},
		"shattered-veil": {
			"safe-code": {
				id: "safe-code",
				name: "Safe Code",
				component: ShatteredVeilSafeCodeSection,
				gameId: "bo6",
				gameName: "Black Ops 6",
				mapId: "shattered-veil",
				mapName: "Shattered Veil",
			},
			"chalkboard-code": {
				id: "chalkboard-code",
				name: "Chalkboard Code",
				component: ShatteredVeilChalkboardCodeSection,
				gameId: "bo6",
				gameName: "Black Ops 6",
				mapId: "shattered-veil",
				mapName: "Shattered Veil",
			},
		},
		reckoning: {
			"door-code": {
				id: "door-code",
				name: "Door Code",
				component: ReckoningDoorCodeSection,
				gameId: "bo6",
				gameName: "Black Ops 6",
				mapId: "reckoning",
				mapName: "Reckoning",
			},
			"documents-code": {
				id: "documents-code",
				name: "Documents Code",
				component: ReckoningDocumentsCodeSection,
				gameId: "bo6",
				gameName: "Black Ops 6",
				mapId: "reckoning",
				mapName: "Reckoning",
			},
		},
	},
	bo5: {
		"mauer-der-toten": {
			"safe-code": {
				id: "safe-code",
				name: "Safe Code",
				component: MauerSafeCodeSection,
				gameId: "bo5",
				gameName: "Black Ops Cold War",
				mapId: "mauer-der-toten",
				mapName: "Mauer der Toten",
			},
		},
		"firebase-z": {
			dartboard: {
				id: "dartboard",
				name: "Dartboard",
				component: FirebaseZDartboardSection,
				gameId: "bo5",
				gameName: "Black Ops Cold War",
				mapId: "firebase-z",
				mapName: "Firebase Z",
			},
		},
	},
	bo4: {
		"voyage-of-despair": {
			clock: {
				id: "clock",
				name: "Clock",
				component: VoyageClockSection,
				gameId: "bo4",
				gameName: "Black Ops 4",
				mapId: "voyage-of-despair",
				mapName: "Voyage of Despair",
			},
			outlet: {
				id: "outlet",
				name: "Outlet",
				component: VoyageOutletSection,
				gameId: "bo4",
				gameName: "Black Ops 4",
				mapId: "voyage-of-despair",
				mapName: "Voyage of Despair",
			},
			planet: {
				id: "planet",
				name: "Planet",
				component: VoyagePlanetSection,
				gameId: "bo4",
				gameName: "Black Ops 4",
				mapId: "voyage-of-despair",
				mapName: "Voyage of Despair",
			},
		},
		ix: {
			"ra-symbols": {
				id: "ra-symbols",
				name: "Ra Symbols",
				component: IxRaSymbolsSection,
				gameId: "bo4",
				gameName: "Black Ops 4",
				mapId: "ix",
				mapName: "IX",
			},
		},
		"blood-of-the-dead": {
			"power-house": {
				id: "power-house",
				name: "Power House",
				component: BloodPowerHouseSection,
				gameId: "bo4",
				gameName: "Black Ops 4",
				mapId: "blood-of-the-dead",
				mapName: "Blood of the Dead",
			},
			"morse-code": {
				id: "morse-code",
				name: "Morse Code",
				component: BloodMorseCodeSection,
				gameId: "bo4",
				gameName: "Black Ops 4",
				mapId: "blood-of-the-dead",
				mapName: "Blood of the Dead",
			},
		},
		classified: {
			codes: {
				id: "codes",
				name: "Codes",
				component: ClassifiedCodesSection,
				gameId: "bo4",
				gameName: "Black Ops 4",
				mapId: "classified",
				mapName: "Classified",
			},
		},
		"dead-of-the-night": {
			"alastair-folly": {
				id: "alastair-folly",
				name: "Alastair's Folly",
				component: DeadAlastairFollySection,
				gameId: "bo4",
				gameName: "Black Ops 4",
				mapId: "dead-of-the-night",
				mapName: "Dead of the Night",
			},
			scratches: {
				id: "scratches",
				name: "Scratches",
				component: DeadScratchesSection,
				gameId: "bo4",
				gameName: "Black Ops 4",
				mapId: "dead-of-the-night",
				mapName: "Dead of the Night",
			},
		},
		"alpha-omega": {
			clocks: {
				id: "clocks",
				name: "Clocks",
				component: AlphaClocksSection,
				gameId: "bo4",
				gameName: "Black Ops 4",
				mapId: "alpha-omega",
				mapName: "Alpha Omega",
			},
			"core-value-3": {
				id: "core-value-3",
				name: "Core Value 3",
				component: AlphaCoreValue3Section,
				gameId: "bo4",
				gameName: "Black Ops 4",
				mapId: "alpha-omega",
				mapName: "Alpha Omega",
			},
			"core-value-4": {
				id: "core-value-4",
				name: "Core Value 4",
				component: AlphaCoreValue4Section,
				gameId: "bo4",
				gameName: "Black Ops 4",
				mapId: "alpha-omega",
				mapName: "Alpha Omega",
			},
			"unlock-adam": {
				id: "unlock-adam",
				name: "Unlock A.D.A.M.",
				component: AlphaUnlockAdamSection,
				gameId: "bo4",
				gameName: "Black Ops 4",
				mapId: "alpha-omega",
				mapName: "Alpha Omega",
			},
		},
		"tag-der-toten": {
			"orb-locations": {
				id: "orb-locations",
				name: "Orb Locations",
				component: TagOrbLocationsSection,
				gameId: "bo4",
				gameName: "Black Ops 4",
				mapId: "tag-der-toten",
				mapName: "Tag der Toten",
			},
			"seal-of-duality": {
				id: "seal-of-duality",
				name: "Seal of Duality",
				component: TagSealOfDualitySection,
				gameId: "bo4",
				gameName: "Black Ops 4",
				mapId: "tag-der-toten",
				mapName: "Tag der Toten",
			},
			totems: {
				id: "totems",
				name: "Totems",
				component: TagTotemsSection,
				gameId: "bo4",
				gameName: "Black Ops 4",
				mapId: "tag-der-toten",
				mapName: "Tag der Toten",
			},
			"apothican-offerings": {
				id: "apothican-offerings",
				name: "Apothican Offerings",
				component: TagApothicanOfferingsSection,
				gameId: "bo4",
				gameName: "Black Ops 4",
				mapId: "tag-der-toten",
				mapName: "Tag der Toten",
			},
		},
	},
	bo3: {
		"der-eisendrache": {
			"simon-says": {
				id: "simon-says",
				name: "Simon Says",
				component: DerEisendracheSimonSaysSection,
				gameId: "bo3",
				gameName: "Black Ops 3",
				mapId: "der-eisendrache",
				mapName: "Der Eisendrache",
			},
		},
		"gorod-krovi": {
			valves: {
				id: "valves",
				name: "Valves",
				component: GorodKroviValvesSection,
				gameId: "bo3",
				gameName: "Black Ops 3",
				mapId: "gorod-krovi",
				mapName: "Gorod Krovi",
			},
			bombs: {
				id: "bombs",
				name: "Bombs",
				component: GorodKroviBombsSection,
				gameId: "bo3",
				gameName: "Black Ops 3",
				mapId: "gorod-krovi",
				mapName: "Gorod Krovi",
			},
		},
		revelations: {
			kronorium: {
				id: "kronorium",
				name: "Kronorium",
				component: RevelationsKronoriumSection,
				gameId: "bo3",
				gameName: "Black Ops 3",
				mapId: "revelations",
				mapName: "Revelations",
			},
		},
		"shadows-of-evil": {
			"egg-symbols": {
				id: "egg-symbols",
				name: "Egg Symbols",
				component: ShadowsEggSymbols,
				gameId: "bo3",
				gameName: "Black Ops 3",
				mapId: "shadows-of-evil",
				mapName: "Shadows of Evil",
			},
		},
	},
	bo1: {
		moon: {
			"samantha-says": {
				id: "samantha-says",
				name: "Samantha Says",
				component: MoonSamanthaSays,
				gameId: "bo1",
				gameName: "Black Ops 1",
				mapId: "moon",
				mapName: "Moon",
			},
		},
	},
	bo2: {
		"die-rise": {
			"mahjong-tiles": {
				id: "mahjong-tiles",
				name: "Mahjong Tiles",
				component: DieRiseMahjongTilesSection,
				gameId: "bo2",
				gameName: "Black Ops 2",
				mapId: "die-rise",
				mapName: "Die Rise",
			},
		},
	},
};

/**
 * Get a section entry by its full path
 */
export function getSectionByPath(
	gameId: string,
	mapId: string,
	sectionId: string
): SectionRegistryEntry | undefined {
	return SECTION_REGISTRY[gameId]?.[mapId]?.[sectionId];
}

/**
 * Get all sections across all games and maps as a flat array
 */
export function getAllSections(): SectionRegistryEntry[] {
	const sections: SectionRegistryEntry[] = [];

	for (const gameId in SECTION_REGISTRY) {
		for (const mapId in SECTION_REGISTRY[gameId]) {
			for (const sectionId in SECTION_REGISTRY[gameId][mapId]) {
				sections.push(SECTION_REGISTRY[gameId][mapId][sectionId]);
			}
		}
	}

	return sections;
}

/**
 * Get all sections for a specific game
 */
export function getSectionsByGame(gameId: string): SectionRegistryEntry[] {
	const sections: SectionRegistryEntry[] = [];

	if (SECTION_REGISTRY[gameId]) {
		for (const mapId in SECTION_REGISTRY[gameId]) {
			for (const sectionId in SECTION_REGISTRY[gameId][mapId]) {
				sections.push(SECTION_REGISTRY[gameId][mapId][sectionId]);
			}
		}
	}

	return sections;
}

/**
 * Get all sections for a specific map
 */
export function getSectionsByMap(
	gameId: string,
	mapId: string
): SectionRegistryEntry[] {
	const sections: SectionRegistryEntry[] = [];

	if (SECTION_REGISTRY[gameId]?.[mapId]) {
		for (const sectionId in SECTION_REGISTRY[gameId][mapId]) {
			sections.push(SECTION_REGISTRY[gameId][mapId][sectionId]);
		}
	}

	return sections;
}

// Games listed in release-date order (oldest first)
const GAME_ORDER = ["bo7", "bo6", "bo5", "bo4", "iw", "bo3", "bo2", "bo1"];

// Maps listed in release-date order for games that need explicit ordering
const MAP_ORDER: Record<string, string[]> = {
	bo7: [
		"ashes-of-the-damned",
		"astra-malorum",
		"paradox-junction",
		"totenreich",
		"kowakujo",
		"rex-infernus",
	],
};

/**
 * Get all unique games in the registry, ordered by release date
 */
export function getAllGames(): Array<{ id: string; name: string }> {
	return GAME_ORDER.filter((gameId) => SECTION_REGISTRY[gameId]).map(
		(gameId) => {
			const firstSection = getSectionsByGame(gameId)[0];
			return {
				id: gameId,
				name: firstSection?.gameName || gameId,
			};
		},
	);
}

/**
 * Get all unique maps for a specific game, ordered by release date where defined
 */
export function getMapsByGame(
	gameId: string
): Array<{ id: string; name: string }> {
	if (!SECTION_REGISTRY[gameId]) return [];

	const allMapIds = Object.keys(SECTION_REGISTRY[gameId]);
	const order = MAP_ORDER[gameId];
	const orderedMapIds = order
		? [
				...order.filter((id) => allMapIds.includes(id)),
				...allMapIds.filter((id) => !order.includes(id)),
			]
		: allMapIds;

	return orderedMapIds.map((mapId) => {
		const firstSection = getSectionsByMap(gameId, mapId)[0];
		return {
			id: mapId,
			name: firstSection?.mapName || mapId,
		};
	});
}
