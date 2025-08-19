export const BO6_MAPS = [
	{
		id: "terminus",
		name: "Terminus",
		status: "Available",
		route: "/bo6/terminus",
		component: () =>
			import("../../components/games/bo6/maps/terminus/Terminus.jsx"),
		available: true,
		tools: ["Nathan code", "Code Calculator"],
		difficulty: "medium",
	},
	{
		id: "liberty-falls",
		name: "Liberty Falls",
		status: "Not planned",
		route: "/bo6/liberty-falls",
		component: null,
		available: false,
		tools: ["N/A"],
		difficulty: "easy",
	},
	{
		id: "citadelle-des-morts",
		name: "Citadelle des Morts",
		status: "Development in progress",
		route: "/bo6/citadelle-des-morts",
		component: null,
		available: false,
		tools: ["Pages/Traps"],
		difficulty: "medium",
	},
	{
		id: "the-tomb",
		name: "The Tomb",
		status: "Coming later",
		route: "/bo6/the-tomb",
		component: null,
		available: false,
		tools: ["Upgrade symbols"],
		difficulty: "easy",
	},
	{
		id: "shattered-veil",
		name: "Shattered Veil",
		status: "Available",
		route: "/bo6/shattered-veil",
		component: () =>
			import(
				"../../components/games/bo6/maps/shattered-veil/ShatteredVeil.jsx"
			),
		available: true,
		tools: ["Chalkboard Code", "Safe Code"],
		difficulty: "easy",
	},
	{
		id: "reckoning",
		name: "Reckoning",
		status: "Available",
		route: "/bo6/reckoning",
		component: () =>
			import("../../components/games/bo6/maps/reckoning/Reckoning.jsx"),
		available: true,
		tools: ["Documents Code", "Door Code"],
		difficulty: "medium",
	},
];

export const getBO6MapById = (mapId) => {
	return BO6_MAPS.find((map) => map.id === mapId) || null;
};

export const getAvailableBO6Maps = () => {
	return BO6_MAPS.filter((map) => map.available);
};
