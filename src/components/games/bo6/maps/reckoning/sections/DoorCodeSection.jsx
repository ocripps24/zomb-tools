import { useState, useEffect, useRef } from "react";
import Button from "../../../../../common/Button";

// Complete periodic table (118 elements) with grid positions
const PERIODIC_TABLE = [
	// Period 1
	{ symbol: "H", atomicNumber: 1, period: 1, group: 1 },
	{ symbol: "He", atomicNumber: 2, period: 1, group: 18 },

	// Period 2
	{ symbol: "Li", atomicNumber: 3, period: 2, group: 1 },
	{ symbol: "Be", atomicNumber: 4, period: 2, group: 2 },
	{ symbol: "B", atomicNumber: 5, period: 2, group: 13 },
	{ symbol: "C", atomicNumber: 6, period: 2, group: 14 },
	{ symbol: "N", atomicNumber: 7, period: 2, group: 15 },
	{ symbol: "O", atomicNumber: 8, period: 2, group: 16 },
	{ symbol: "F", atomicNumber: 9, period: 2, group: 17 },
	{ symbol: "Ne", atomicNumber: 10, period: 2, group: 18 },

	// Period 3
	{ symbol: "Na", atomicNumber: 11, period: 3, group: 1 },
	{ symbol: "Mg", atomicNumber: 12, period: 3, group: 2 },
	{ symbol: "Al", atomicNumber: 13, period: 3, group: 13 },
	{ symbol: "Si", atomicNumber: 14, period: 3, group: 14 },
	{ symbol: "P", atomicNumber: 15, period: 3, group: 15 },
	{ symbol: "S", atomicNumber: 16, period: 3, group: 16 },
	{ symbol: "Cl", atomicNumber: 17, period: 3, group: 17 },
	{ symbol: "Ar", atomicNumber: 18, period: 3, group: 18 },

	// Period 4
	{ symbol: "K", atomicNumber: 19, period: 4, group: 1 },
	{ symbol: "Ca", atomicNumber: 20, period: 4, group: 2 },
	{ symbol: "Sc", atomicNumber: 21, period: 4, group: 3 },
	{ symbol: "Ti", atomicNumber: 22, period: 4, group: 4 },
	{ symbol: "V", atomicNumber: 23, period: 4, group: 5 },
	{ symbol: "Cr", atomicNumber: 24, period: 4, group: 6 },
	{ symbol: "Mn", atomicNumber: 25, period: 4, group: 7 },
	{ symbol: "Fe", atomicNumber: 26, period: 4, group: 8 },
	{ symbol: "Co", atomicNumber: 27, period: 4, group: 9 },
	{ symbol: "Ni", atomicNumber: 28, period: 4, group: 10 },
	{ symbol: "Cu", atomicNumber: 29, period: 4, group: 11 },
	{ symbol: "Zn", atomicNumber: 30, period: 4, group: 12 },
	{ symbol: "Ga", atomicNumber: 31, period: 4, group: 13 },
	{ symbol: "Ge", atomicNumber: 32, period: 4, group: 14 },
	{ symbol: "As", atomicNumber: 33, period: 4, group: 15 },
	{ symbol: "Se", atomicNumber: 34, period: 4, group: 16 },
	{ symbol: "Br", atomicNumber: 35, period: 4, group: 17 },
	{ symbol: "Kr", atomicNumber: 36, period: 4, group: 18 },

	// Period 5
	{ symbol: "Rb", atomicNumber: 37, period: 5, group: 1 },
	{ symbol: "Sr", atomicNumber: 38, period: 5, group: 2 },
	{ symbol: "Y", atomicNumber: 39, period: 5, group: 3 },
	{ symbol: "Zr", atomicNumber: 40, period: 5, group: 4 },
	{ symbol: "Nb", atomicNumber: 41, period: 5, group: 5 },
	{ symbol: "Mo", atomicNumber: 42, period: 5, group: 6 },
	{ symbol: "Tc", atomicNumber: 43, period: 5, group: 7 },
	{ symbol: "Ru", atomicNumber: 44, period: 5, group: 8 },
	{ symbol: "Rh", atomicNumber: 45, period: 5, group: 9 },
	{ symbol: "Pd", atomicNumber: 46, period: 5, group: 10 },
	{ symbol: "Ag", atomicNumber: 47, period: 5, group: 11 },
	{ symbol: "Cd", atomicNumber: 48, period: 5, group: 12 },
	{ symbol: "In", atomicNumber: 49, period: 5, group: 13 },
	{ symbol: "Sn", atomicNumber: 50, period: 5, group: 14 },
	{ symbol: "Sb", atomicNumber: 51, period: 5, group: 15 },
	{ symbol: "Te", atomicNumber: 52, period: 5, group: 16 },
	{ symbol: "I", atomicNumber: 53, period: 5, group: 17 },
	{ symbol: "Xe", atomicNumber: 54, period: 5, group: 18 },

	// Period 6
	{ symbol: "Cs", atomicNumber: 55, period: 6, group: 1 },
	{ symbol: "Ba", atomicNumber: 56, period: 6, group: 2 },
	{ symbol: "La", atomicNumber: 57, period: 6, group: 3 },
	{ symbol: "Ce", atomicNumber: 58, period: 8, group: 4 }, // Lanthanides (row 8)
	{ symbol: "Pr", atomicNumber: 59, period: 8, group: 5 },
	{ symbol: "Nd", atomicNumber: 60, period: 8, group: 6 },
	{ symbol: "Pm", atomicNumber: 61, period: 8, group: 7 },
	{ symbol: "Sm", atomicNumber: 62, period: 8, group: 8 },
	{ symbol: "Eu", atomicNumber: 63, period: 8, group: 9 },
	{ symbol: "Gd", atomicNumber: 64, period: 8, group: 10 },
	{ symbol: "Tb", atomicNumber: 65, period: 8, group: 11 },
	{ symbol: "Dy", atomicNumber: 66, period: 8, group: 12 },
	{ symbol: "Ho", atomicNumber: 67, period: 8, group: 13 },
	{ symbol: "Er", atomicNumber: 68, period: 8, group: 14 },
	{ symbol: "Tm", atomicNumber: 69, period: 8, group: 15 },
	{ symbol: "Yb", atomicNumber: 70, period: 8, group: 16 },
	{ symbol: "Lu", atomicNumber: 71, period: 8, group: 17 },
	{ symbol: "Hf", atomicNumber: 72, period: 6, group: 4 },
	{ symbol: "Ta", atomicNumber: 73, period: 6, group: 5 },
	{ symbol: "W", atomicNumber: 74, period: 6, group: 6 },
	{ symbol: "Re", atomicNumber: 75, period: 6, group: 7 },
	{ symbol: "Os", atomicNumber: 76, period: 6, group: 8 },
	{ symbol: "Ir", atomicNumber: 77, period: 6, group: 9 },
	{ symbol: "Pt", atomicNumber: 78, period: 6, group: 10 },
	{ symbol: "Au", atomicNumber: 79, period: 6, group: 11 },
	{ symbol: "Hg", atomicNumber: 80, period: 6, group: 12 },
	{ symbol: "Tl", atomicNumber: 81, period: 6, group: 13 },
	{ symbol: "Pb", atomicNumber: 82, period: 6, group: 14 },
	{ symbol: "Bi", atomicNumber: 83, period: 6, group: 15 },
	{ symbol: "Po", atomicNumber: 84, period: 6, group: 16 },
	{ symbol: "At", atomicNumber: 85, period: 6, group: 17 },
	{ symbol: "Rn", atomicNumber: 86, period: 6, group: 18 },

	// Period 7
	{ symbol: "Fr", atomicNumber: 87, period: 7, group: 1 },
	{ symbol: "Ra", atomicNumber: 88, period: 7, group: 2 },
	{ symbol: "Ac", atomicNumber: 89, period: 7, group: 3 },
	{ symbol: "Th", atomicNumber: 90, period: 9, group: 4 }, // Actinides (row 9)
	{ symbol: "Pa", atomicNumber: 91, period: 9, group: 5 },
	{ symbol: "U", atomicNumber: 92, period: 9, group: 6 },
	{ symbol: "Np", atomicNumber: 93, period: 9, group: 7 },
	{ symbol: "Pu", atomicNumber: 94, period: 9, group: 8 },
	{ symbol: "Am", atomicNumber: 95, period: 9, group: 9 },
	{ symbol: "Cm", atomicNumber: 96, period: 9, group: 10 },
	{ symbol: "Bk", atomicNumber: 97, period: 9, group: 11 },
	{ symbol: "Cf", atomicNumber: 98, period: 9, group: 12 },
	{ symbol: "Es", atomicNumber: 99, period: 9, group: 13 },
	{ symbol: "Fm", atomicNumber: 100, period: 9, group: 14 },
	{ symbol: "Md", atomicNumber: 101, period: 9, group: 15 },
	{ symbol: "No", atomicNumber: 102, period: 9, group: 16 },
	{ symbol: "Lr", atomicNumber: 103, period: 9, group: 17 },
	{ symbol: "Rf", atomicNumber: 104, period: 7, group: 4 },
	{ symbol: "Db", atomicNumber: 105, period: 7, group: 5 },
	{ symbol: "Sg", atomicNumber: 106, period: 7, group: 6 },
	{ symbol: "Bh", atomicNumber: 107, period: 7, group: 7 },
	{ symbol: "Hs", atomicNumber: 108, period: 7, group: 8 },
	{ symbol: "Mt", atomicNumber: 109, period: 7, group: 9 },
	{ symbol: "Ds", atomicNumber: 110, period: 7, group: 10 },
	{ symbol: "Rg", atomicNumber: 111, period: 7, group: 11 },
	{ symbol: "Cn", atomicNumber: 112, period: 7, group: 12 },
	{ symbol: "Nh", atomicNumber: 113, period: 7, group: 13 },
	{ symbol: "Fl", atomicNumber: 114, period: 7, group: 14 },
	{ symbol: "Mc", atomicNumber: 115, period: 7, group: 15 },
	{ symbol: "Lv", atomicNumber: 116, period: 7, group: 16 },
	{ symbol: "Ts", atomicNumber: 117, period: 7, group: 17 },
	{ symbol: "Og", atomicNumber: 118, period: 7, group: 18 },
];

// Create a lookup object for quick access
const ELEMENT_LOOKUP = {};
PERIODIC_TABLE.forEach((element) => {
	ELEMENT_LOOKUP[element.symbol] = element;
});

// Common words dictionaries for each screen
const SCREEN_1_WORDS = [
	"ABHORRENT",
	"BELICOSE",
	"CASTIGATE",
	"DECEIT",
	"ENERVATE",
	"FOREBODING",
	"GUILE",
	"HISTERIA",
	"INHUMANE",
	"KNAVISH",
	"LIABILITY",
	"MALEDICTION",
	"NETTLESOME",
	"PERJORATIVE",
	"RUINOUS",
	"SCORN",
	"TRAITOR",
	"WRATH",
	"XENOTROPIC",
	"ZYMOTIC",
];

const SCREEN_2_WORDS = [
	"ABHORRENT",
	"DECEIT",
	"ENERVATE",
	"FOREBODING",
	"GUILE",
	"HISTERIA",
	"INHUMANE",
	"LIABILITY",
	"MALEDICTION",
	"NETTLESOME",
	"OBSEQUIOUS",
	"RUINOUS",
	"SCORN",
	"TRAITOR",
	"UNDERMINE",
	"YOBBISH",
];

function DoorCodeSection({ data, onChange }) {
	const [localData, setLocalData] = useState(
		data || { screen1: "", screen2: "" }
	);
	const isInitializing = useRef(true);

	// Load from localStorage on mount or when parent data changes (reset)
	useEffect(() => {
		const isParentDataEmpty = !data || Object.keys(data).length === 0;

		if (isParentDataEmpty) {
			const saved = localStorage.getItem("reckoning-door-data");
			if (saved) {
				try {
					const parsedData = JSON.parse(saved);
					setLocalData(parsedData);
				} catch (e) {
					console.error("Failed to parse door data:", e);
					const initial = { screen1: "", screen2: "" };
					setLocalData(initial);
				}
			} else {
				const initial = { screen1: "", screen2: "" };
				setLocalData(initial);
			}
		}
		isInitializing.current = true;
	}, [data]);

	// Save to localStorage and update parent when data changes
	useEffect(() => {
		localStorage.setItem("reckoning-door-data", JSON.stringify(localData));

		if (!isInitializing.current) {
			onChange(localData);
		} else {
			isInitializing.current = false;
		}
	}, [localData]); // Removed onChange from dependencies to prevent infinite loop

	const handleScreenChange = (screen, value) => {
		setLocalData((prev) => ({
			...prev,
			[screen]: value.trim(),
		}));
	};

	const handleWordSelect = (screen, word) => {
		setLocalData((prev) => {
			// If the word is already selected, deselect it (clear the field)
			if (prev[screen] === word) {
				return {
					...prev,
					[screen]: "",
				};
			}
			// Otherwise, select the word
			return {
				...prev,
				[screen]: word,
			};
		});
	};

	const generateElementSymbol = () => {
		const word1 = localData.screen1?.trim();
		const word2 = localData.screen2?.trim();

		if (!word1 && !word2) return "";

		let firstLetter = word1 ? word1.charAt(0).toUpperCase() : "";
		let secondLetter = word2 ? word2.charAt(0).toLowerCase() : "";

		return firstLetter + secondLetter;
	};

	const getPossibleElements = () => {
		const word1 = localData.screen1?.trim();
		const word2 = localData.screen2?.trim();

		if (!word1) return { singleScreen: [], twoScreen: [] };

		const firstLetter = word1.charAt(0).toUpperCase();

		// If we have both words, try to find exact match
		if (word1 && word2) {
			const symbol = firstLetter + word2.charAt(0).toLowerCase();
			const element = ELEMENT_LOOKUP[symbol];
			return {
				singleScreen: [],
				twoScreen: element ? [element] : [],
			};
		}

		// If we only have first word, find possible elements based on available Screen 2 words
		if (word1 && !word2) {
			// Single letter element (if exists)
			const singleLetterElement = ELEMENT_LOOKUP[firstLetter];
			const singleScreen = singleLetterElement ? [singleLetterElement] : [];

			// Two letter elements based on Screen 2 dictionary
			const twoScreen = SCREEN_2_WORDS.map((word) => {
				const secondLetter = word.charAt(0).toLowerCase();
				const symbol = firstLetter + secondLetter;
				return ELEMENT_LOOKUP[symbol];
			}).filter((element) => element !== undefined);

			return { singleScreen, twoScreen };
		}

		return { singleScreen: [], twoScreen: [] };
	};

	const getAtomicNumber = () => {
		const { singleScreen, twoScreen } = getPossibleElements();
		const allPossible = [...singleScreen, ...twoScreen];
		// Return single element if there's exactly one match across both categories
		return allPossible.length === 1 ? allPossible[0] : null;
	};

	const formatDoorCode = (atomicNumber) => {
		if (!atomicNumber) return null;
		// Add leading zeros: < 10 = "00X", < 100 = "0XX", >= 100 = "XXX"
		return atomicNumber.toString().padStart(3, "0");
	};

	const resetAll = () => {
		setLocalData({ screen1: "", screen2: "" });
	};

	const elementSymbol = generateElementSymbol();
	const elementData = getAtomicNumber();
	const { singleScreen, twoScreen } = getPossibleElements();
	const doorCode = elementData
		? formatDoorCode(elementData.atomicNumber)
		: null;
	const hasMultiplePossibilities =
		singleScreen.length > 0 || twoScreen.length > 0;

	return (
		<div className="door-code-section">
			<div className="section-header">
				<div className="section-header__top-row">
					<h3 className="section-header__title">T1 Bioweapons Lab Door Code</h3>
					<Button variantType="secondary" onClick={resetAll}>
						Reset Door Code
					</Button>
				</div>
				<p className="section-header__description">
					Enter the words displayed on the screens in the T1 Mutant Research Lab
					area.
					<br />
					The atomic number of the corresponding element is your door code.
				</p>
			</div>

			{/* Screen Inputs */}
			<div className="screens-grid">
				<div className="screen-input">
					<label className="screen-label">
						Screen 1 (near Deadshot Daiquiri)
						<span className="screen-note">Always shows a word</span>
					</label>
					<input
						type="text"
						value={localData.screen1 || ""}
						onChange={(e) => handleScreenChange("screen1", e.target.value)}
						placeholder="Enter word from screen 1"
						className="screen-word-input"
					/>
				</div>

				<div className="screen-input">
					<label className="screen-label">
						Screen 2 (near PHD Flopper)
						<span className="screen-note">May not always show a word</span>
					</label>
					<input
						type="text"
						value={localData.screen2 || ""}
						onChange={(e) => handleScreenChange("screen2", e.target.value)}
						placeholder="Enter word from screen 2 (if any)"
						className="screen-word-input"
					/>
				</div>
			</div>

			{/* Word Dictionaries */}
			<div className="word-dictionaries">
				<h4>Common Screen Words</h4>
				<p className="dictionaries-description">
					Click on a word to quickly select it for the corresponding screen.
				</p>

				<div className="dictionaries-grid">
					<div className="dictionary-column">
						<h5>Screen 1 Words</h5>
						<div className="word-buttons">
							{SCREEN_1_WORDS.map((word) => (
								<button
									key={word}
									onClick={() => handleWordSelect("screen1", word)}
									className={`word-btn ${
										localData.screen1 === word ? "word-btn--selected" : ""
									}`}
								>
									{word}
								</button>
							))}
						</div>
					</div>

					<div className="dictionary-column">
						<h5>Screen 2 Words</h5>
						<div className="word-buttons">
							{SCREEN_2_WORDS.map((word) => (
								<button
									key={word}
									onClick={() => handleWordSelect("screen2", word)}
									className={`word-btn ${
										localData.screen2 === word ? "word-btn--selected" : ""
									}`}
								>
									{word}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Door Code Result */}
			{doorCode && (
				<div className="door-code-result">
					<h4>Door Code</h4>
					<div className="code-display">
						<span className="code-value">{doorCode}</span>
					</div>
					<p className="code-instruction">
						Enter this code to access the T1 Bioweapons lab.
					</p>
					{elementData && (
						<p className="element-info">Element: {elementData.symbol}</p>
					)}
				</div>
			)}

			{/* Possible Elements when no definitive answer */}
			{!doorCode && hasMultiplePossibilities && localData.screen1 && (
				<div className="door-code-result">
					<h4>Possible Door Codes</h4>
					<p className="code-instruction">
						Multiple elements possible with "
						{localData.screen1?.charAt(0).toUpperCase()}".
						{twoScreen.length > 0 &&
							" Enter a word on Screen 2 to determine the exact code."}
					</p>

					{singleScreen.length > 0 && (
						<div className="possible-category">
							<h5>Screen 1 only (if Screen 2 is blank):</h5>
							<div className="possible-codes">
								{singleScreen.map((element) => (
									<div key={element.symbol} className="possible-code-item">
										<span className="element-display">{element.symbol}</span>
										<span className="code-display-small">
											{formatDoorCode(element.atomicNumber)}
										</span>
									</div>
								))}
							</div>
						</div>
					)}

					{twoScreen.length > 0 && (
						<div className="possible-category">
							<h5>With Screen 2 word:</h5>
							<div className="possible-codes">
								{twoScreen.map((element) => (
									<div key={element.symbol} className="possible-code-item">
										<span className="element-display">{element.symbol}</span>
										<span className="code-display-small">
											{formatDoorCode(element.atomicNumber)}
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}

			{elementSymbol && !elementData && !hasMultiplePossibilities && (
				<div className="element-not-found">
					<p>
						Element "{elementSymbol}" not found in periodic table. Please check
						your input.
					</p>
				</div>
			)}

			{/* Periodic Table */}
			<div className="periodic-table-reference">
				<h4>Periodic Table</h4>
				<div className="periodic-table-grid">
					{PERIODIC_TABLE.map((element) => {
						const isExactMatch = elementSymbol === element.symbol;
						const isPossibleMatch =
							singleScreen.some((pe) => pe.symbol === element.symbol) ||
							twoScreen.some((pe) => pe.symbol === element.symbol);

						return (
							<div
								key={element.symbol}
								className={`periodic-element ${
									isExactMatch
										? "periodic-element--highlighted"
										: isPossibleMatch
										? "periodic-element--possible"
										: ""
								}`}
								style={{
									gridRow: element.period,
									gridColumn: element.group,
								}}
							>
								<span className="element-number">{element.atomicNumber}</span>
								<span className="element-symbol">{element.symbol}</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default DoorCodeSection;
