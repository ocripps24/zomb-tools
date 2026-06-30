import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

import mask1Img from "@/assets/maps/bo7/kowakujo/kowakujo-mask-1.png";
import mask2Img from "@/assets/maps/bo7/kowakujo/kowakujo-mask-2.png";
import mask3Img from "@/assets/maps/bo7/kowakujo/kowakujo-mask-3.png";
import mask4Img from "@/assets/maps/bo7/kowakujo/kowakujo-mask-4.png";
import mask5Img from "@/assets/maps/bo7/kowakujo/kowakujo-mask-5.png";

// ─── Constants ────────────────────────────────────────────────────────────────

const MASKS = [
	{ id: 0, src: mask1Img, alt: "Mask 1" },
	{ id: 1, src: mask2Img, alt: "Mask 2" },
	{ id: 2, src: mask3Img, alt: "Mask 3" },
	{ id: 3, src: mask4Img, alt: "Mask 4" },
	{ id: 4, src: mask5Img, alt: "Mask 5" },
] as const;

const ROUND_SIZES = [3, 4, 5] as const;

const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th"] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface MasksData {
	currentSequence: number[];
	// 0–2 = that round is active; 3 = all rounds complete
	activeRound: number;
}

const DEFAULT_VALUE: MasksData = {
	currentSequence: [],
	activeRound: 0,
};

// ─── Section ──────────────────────────────────────────────────────────────────

function MasksSection(props: BaseSectionProps<MasksData>) {
	return (
		<BaseSection
			config={{
				storageKey: "kowakujo-masks-data",
				defaultValue: DEFAULT_VALUE,
				title: "Masks",
				description:
					"Watch the masks flash in sequence and record the order. Kill the zombies wearing those masks to advance each round.",
				resetButtonText: "Reset",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Fox Mask",
							text: "Use the kite travel and veer right past the tree in Central Courtyard. Interact with the building as you pass — the mask sits at the end of the eaves.",
						},
						{
							label: "Setup",
							text: "Place the fox mask on the wall with the other masks, then interact with the wall to start the sequence.",
						},
						{
							label: "Sequence",
							text: "The masks will flash one at a time. Record them in order below, then kill the zombies wearing those masks in the same order.",
						},
						{
							label: "Rounds",
							text: "There are 3 rounds — 3 masks, then 4, then 5. Each round shows a completely new sequence.",
						},
					],
				},
			}}
			getProgress={(data: MasksData) => ({
				completed: Math.min(data.activeRound ?? 0, 3),
				total: 3,
				isComplete: (data.activeRound ?? 0) === 3,
			})}
			{...props}
		>
			{({ data, setData }) => {
				const activeRound = data.activeRound ?? 0;
				const allComplete = activeRound === 3;
				// Guard against stale localStorage data from a previous data-model shape
				const currentSequence = data.currentSequence ?? [];
				const currentRoundSize = allComplete ? 0 : ROUND_SIZES[activeRound];
				const isRoundComplete =
					!allComplete && currentSequence.length === currentRoundSize;

				const handleMaskClick = (maskId: number) => {
					if (allComplete || isRoundComplete) return;
					setData((prev) => ({
						...prev,
						currentSequence: [...(prev.currentSequence ?? []), maskId],
					}));
				};

				const handleUndo = () => {
					setData((prev) => ({
						...prev,
						currentSequence: (prev.currentSequence ?? []).slice(0, -1),
					}));
				};

				const handleJumpToRound = (round: number) => {
					setData({ currentSequence: [], activeRound: round });
				};

				const handleAdvance = () => {
					setData({ currentSequence: [], activeRound: activeRound + 1 });
				};

				return (
					<div className="masks-section">
						{/* Mask picker — hidden once all rounds are complete */}
						{!allComplete && (
							<div className="masks-picker">
								<div className="masks-picker__buttons">
									{MASKS.map((mask) => (
										<button
											key={mask.id}
											className="masks-picker__btn"
											onClick={() => handleMaskClick(mask.id)}
											disabled={isRoundComplete}
											type="button"
											title={mask.alt}
										>
											<img
												src={mask.src}
												alt={mask.alt}
												className="masks-picker__img"
											/>
										</button>
									))}
								</div>
								<button
									className="masks-picker__undo"
									onClick={handleUndo}
									disabled={currentSequence.length === 0}
									type="button"
								>
									Undo
								</button>
							</div>
						)}

						{/* ── Round controls: jump buttons + advance ──────────── */}
						<div className="masks-round-controls">
							{([0, 1, 2] as const).map((r) => (
								<button
									key={r}
									className={[
										"masks-round-btn",
										activeRound === r && !allComplete
											? "masks-round-btn--active"
											: "",
									]
										.filter(Boolean)
										.join(" ")}
									onClick={() => handleJumpToRound(r)}
									type="button"
								>
									Round {r + 1}
								</button>
							))}
							<button
								className={[
									"masks-advance-btn",
									allComplete ? "masks-advance-btn--complete" : "",
								]
									.filter(Boolean)
									.join(" ")}
								onClick={handleAdvance}
								disabled={!isRoundComplete}
								type="button"
							>
								{allComplete
									? "Complete ✓"
									: activeRound === 2
										? "Finish"
										: "Next Round →"}
							</button>
						</div>

						{/* ── Sequence slots in a bordered container ──────────── */}
						{!allComplete && (
							<div className="masks-sequence-container">
								<div className="masks-sequence">
									{Array.from({ length: currentRoundSize }, (_, i) => {
										const maskId = currentSequence[i];
										const isFilled = maskId !== undefined;
										return (
											<div key={i} className="masks-slot-wrapper">
												<div
													className={[
														"masks-slot",
														isFilled
															? "masks-slot--filled"
															: "masks-slot--empty",
													].join(" ")}
												>
													{isFilled && (
														<img
															src={MASKS[maskId].src}
															alt={MASKS[maskId].alt}
															className="masks-slot__img"
														/>
													)}
												</div>
												<span className="masks-slot-label">{ORDINALS[i]}</span>
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>
				);
			}}
		</BaseSection>
	);
}

export default MasksSection;
