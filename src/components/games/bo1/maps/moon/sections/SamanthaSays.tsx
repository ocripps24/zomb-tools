import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

interface SamanthaSaysData {
	sequence: number[]; // Array of terminal numbers (1, 2, 3, 4)
}

// Terminal configuration: Red(1), Green(2), Blue(3), Yellow(4)
const TERMINALS = [
	{ id: 1, name: "Red", color: "#E53E3E" },
	{ id: 2, name: "Green", color: "#38A169" },
	{ id: 3, name: "Blue", color: "#3182CE" },
	{ id: 4, name: "Yellow", color: "#D69E2E" },
] as const;

function SamanthaSays(props: BaseSectionProps<SamanthaSaysData>) {
	return (
		<BaseSection
			config={{
				storageKey: "moon-samantha-says-data",
				defaultValue: { sequence: [] },
				title: "Samantha Says",
				description: "Track the terminal sequence shown by the computers",
				resetButtonText: "Clear Sequence",
			}}
			getProgress={(data: SamanthaSaysData) => ({
				completed: data.sequence.length,
				total: 0, // Dynamic length, no fixed total
				isComplete: false, // Never "complete" as it's a tracking tool
			})}
			{...props}
		>
			{({ data, setData }) => {
				const atLimit = data.sequence.length >= 8;
				return (
				<>
					<div className="samantha-says">
						<div className="samantha-says__terminals">
							{TERMINALS.map((terminal) => (
								<button
									key={terminal.id}
									className="samantha-says__terminal"
									style={{
										"--terminal-color": terminal.color
									} as React.CSSProperties}
									disabled={atLimit}
									onClick={() => {
										setData({
											sequence: [...data.sequence, terminal.id],
										});
									}}
									aria-label={`${terminal.name} terminal`}
								/>
							))}
						</div>
					</div>

					{data.sequence.length > 0 && (
						<div className="samantha-says-results">
							<div className="samantha-says-results__header">
								<h3>Terminal Sequence</h3>
								<button
									className="samantha-says-results__undo"
									onClick={() => {
										setData({
											sequence: data.sequence.slice(0, -1),
										});
									}}
									aria-label="Undo last entry"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M3 7v6h6" />
										<path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
									</svg>
									Undo
								</button>
							</div>
							<div className="samantha-says-results__sequence">
								{data.sequence.map((terminalId, index) => {
									const terminal = TERMINALS.find((t) => t.id === terminalId);
									return (
										<div
											key={`step-${index}`}
											className="samantha-says-results__item"
											style={{
												"--result-color": terminal?.color
											} as React.CSSProperties}
										>
											<div className="result-order">{index + 1}</div>
											<div
												className="result-box"
												aria-label={`${terminal?.name} terminal`}
											/>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</>
				);
			}}
		</BaseSection>
	);
}

export default SamanthaSays;
