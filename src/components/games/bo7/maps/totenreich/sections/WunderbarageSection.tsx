import { useEffect, useRef, useState } from "react";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { useSectionSettings } from "@/hooks/useSectionSettings";

type FlashType = "left" | "both" | "right";

interface WunderbarageData {
	seq1: FlashType[];
	seq2: FlashType[];
}

const DEFAULT_VALUE: WunderbarageData = {
	seq1: [],
	seq2: [],
};

function getTotals(entries: FlashType[]) {
	let left = 0;
	let right = 0;
	for (const e of entries) {
		if (e === "left" || e === "both") left++;
		if (e === "right" || e === "both") right++;
	}
	return { left, right };
}

// ─── Sequence Recorder ───────────────────────────────────────────────────────

interface SequenceRecorderProps {
	label: string;
	entries: FlashType[];
	onAdd: (type: FlashType) => void;
	onUndo: () => void;
	isFocused: boolean;
	onFocus: () => void;
}

function SequenceRecorder({
	label,
	entries,
	onAdd,
	onUndo,
	isFocused,
	onFocus,
}: SequenceRecorderProps) {
	const { left, right } = getTotals(entries);
	const hasEntries = entries.length > 0;
	const leftFull = left >= 7;
	const rightFull = right >= 8;
	const hasBoth = entries.some((e) => e === "both");
	const hasIndividualLeft = entries.some((e) => e === "left");
	const hasIndividualRight = entries.some((e) => e === "right");

	return (
		<div
			className={`sequence-recorder${isFocused ? " sequence-recorder--focused" : ""}`}
			onClick={onFocus}
		>
			<div className="sequence-recorder__header">
				<span className="sequence-recorder__label">{label}</span>
				{isFocused && (
					<span className="sequence-recorder__active-badge">Active</span>
				)}
			</div>
			<div className="sequence-recorder__buttons">
				<button
					className="flash-btn flash-btn--left"
					onClick={() => onAdd("left")}
					type="button"
					disabled={!hasBoth || leftFull || hasIndividualRight}
				>
					◀ Left
				</button>
				<button
					className="flash-btn flash-btn--both"
					onClick={() => onAdd("both")}
					type="button"
					disabled={
						leftFull || rightFull || hasIndividualLeft || hasIndividualRight
					}
				>
					Both
				</button>
				<button
					className="flash-btn flash-btn--right"
					onClick={() => onAdd("right")}
					type="button"
					disabled={!hasBoth || rightFull || hasIndividualLeft}
				>
					Right ▶
				</button>
			</div>
			<div className="sequence-recorder__tally">
				<div className="sequence-recorder__tally-item">
					<span className="sequence-recorder__tally-label">Left</span>
					<span className="sequence-recorder__tally-value">
						{hasEntries ? left : "–"}
					</span>
					<span className="sequence-recorder__tally-range">1–7</span>
				</div>
				<div className="sequence-recorder__tally-divider" />
				<div className="sequence-recorder__tally-item">
					<span className="sequence-recorder__tally-label">Right</span>
					<span className="sequence-recorder__tally-value">
						{hasEntries ? right : "–"}
					</span>
					<span className="sequence-recorder__tally-range">1–8</span>
				</div>
			</div>
			<div className="sequence-recorder__history">
				{entries.length === 0 ? (
					<span className="flash-tag flash-tag--both flash-tag--placeholder">
						B
					</span>
				) : (
					entries.map((e, i) => (
						<span key={i} className={`flash-tag flash-tag--${e}`}>
							{e === "left" ? "L" : e === "both" ? "B" : "R"}
						</span>
					))
				)}
			</div>
			<div className="sequence-recorder__footer">
				<button
					className="sequence-recorder__undo"
					onClick={onUndo}
					type="button"
					disabled={!hasEntries}
				>
					↩ Undo last
				</button>
				{isFocused && (
					<div className="sequence-recorder__kbd-hints">
						<kbd>1</kbd>
						<span>Left</span>
						<kbd>2</kbd>
						<span>Both</span>
						<kbd>3</kbd>
						<span>Right</span>
						<kbd>⌫</kbd>
						<span>Undo</span>
					</div>
				)}
			</div>
		</div>
	);
}

// ─── Section ──────────────────────────────────────────────────────────────────

function WunderbarageSection(props: BaseSectionProps<WunderbarageData>) {
	const [focusedSeq, setFocusedSeq] = useState<1 | 2 | null>(null);
	const handlersRef = useRef<{
		addToFocused: (type: FlashType) => void;
		undoFocused: () => void;
	} | null>(null);

	useSectionSettings({
		mapId: "totenreich",
		sectionId: "wunderbarrage",
		sectionName: "Wunderbarrage",
		settings: [],
	});

	useEffect(() => {
		if (focusedSeq === null) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement
			)
				return;
			if (e.key === "1") {
				e.preventDefault();
				handlersRef.current?.addToFocused("left");
			} else if (e.key === "2") {
				e.preventDefault();
				handlersRef.current?.addToFocused("both");
			} else if (e.key === "3") {
				e.preventDefault();
				handlersRef.current?.addToFocused("right");
			} else if (e.key === "Backspace") {
				e.preventDefault();
				handlersRef.current?.undoFocused();
			} else if (e.key === "Escape") {
				setFocusedSeq(null);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [focusedSeq]);

	return (
		<BaseSection
			config={{
				storageKey: "totenreich-wunderbarrage-data",
				defaultValue: DEFAULT_VALUE,
				title: "Wunderbarrage",
				description:
					"Enter Tyr's Head and place the transmitter. Record the flash pattern for each sequence — Both adds to both left and right totals. The two sequences are separated by a brief pause where all three lights are solid.",
				resetButtonText: "Clear All",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "The Lights",
							text: "Three pill-shaped wall lights in a row. The central light stays solid throughout. Only the left and right lights flash.",
						},
						{
							label: "Counting",
							text: "Both = +1 to left AND right. Left = +1 to left only. Right = +1 to right only. Both flashes always occur at the start of a sequence.",
						},
						{
							label: "Two Sequences",
							text: "A short pause follows sequence 1 with a longer pause following sequence 2.",
						},
						{
							label: "Keyboard Mode",
							text: "Click a sequence card to activate it, then use 1 = Left, 2 = Both, 3 = Right, Backspace = Undo. Press Escape to deactivate.",
						},
					],
				},
			}}
			getProgress={(data: WunderbarageData) => {
				const seq1Done = data.seq1.length > 0;
				const seq2Done = data.seq2.length > 0;
				return {
					completed: (seq1Done ? 1 : 0) + (seq2Done ? 1 : 0),
					total: 2,
					isComplete: seq1Done && seq2Done,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				handlersRef.current = {
					addToFocused: (type) => {
						const seq = focusedSeq === 1 ? data.seq1 : data.seq2;
						const { left, right } = getTotals(seq);
						const seqHasBoth = seq.some((e) => e === "both");
						const indLeft = seq.some((e) => e === "left");
						const indRight = seq.some((e) => e === "right");
						if (type === "left" && (!seqHasBoth || left >= 7 || indRight))
							return;
						if (type === "right" && (!seqHasBoth || right >= 8 || indLeft))
							return;
						if (
							type === "both" &&
							(left >= 7 || right >= 8 || indLeft || indRight)
						)
							return;
						if (focusedSeq === 1)
							setData({ ...data, seq1: [...data.seq1, type] });
						else if (focusedSeq === 2)
							setData({ ...data, seq2: [...data.seq2, type] });
					},
					undoFocused: () => {
						if (focusedSeq === 1)
							setData({ ...data, seq1: data.seq1.slice(0, -1) });
						else if (focusedSeq === 2)
							setData({ ...data, seq2: data.seq2.slice(0, -1) });
					},
				};

				const t1 = getTotals(data.seq1);
				const t2 = getTotals(data.seq2);
				const hasAny = data.seq1.length > 0 || data.seq2.length > 0;

				return (
					<div className="wunderbarrage-section">
						<div className="sequence-recorders">
							<SequenceRecorder
								label="Sequence 1"
								entries={data.seq1}
								onAdd={(type) =>
									setData({ ...data, seq1: [...data.seq1, type] })
								}
								onUndo={() =>
									setData({ ...data, seq1: data.seq1.slice(0, -1) })
								}
								isFocused={focusedSeq === 1}
								onFocus={() => setFocusedSeq(1)}
							/>
							<SequenceRecorder
								label="Sequence 2"
								entries={data.seq2}
								onAdd={(type) =>
									setData({ ...data, seq2: [...data.seq2, type] })
								}
								onUndo={() =>
									setData({ ...data, seq2: data.seq2.slice(0, -1) })
								}
								isFocused={focusedSeq === 2}
								onFocus={() => setFocusedSeq(2)}
							/>
						</div>

						{hasAny && (
							<div className="wunderbarrage-result">
								<p className="wunderbarrage-result__heading">Frequency Dials</p>
								<div className="wunderbarrage-result__sequences">
									<div className="result-sequence">
										<p className="result-sequence__label">Sequence 1</p>
										<div className="result-sequence__row">
											<span className="result-sequence__dial-name">
												Amplitude
											</span>
											<span className="result-sequence__value">
												{data.seq1.length > 0 ? t1.left : "–"}
											</span>
										</div>
										<div className="result-sequence__row">
											<span className="result-sequence__dial-name">
												Frequency
											</span>
											<span className="result-sequence__value">
												{data.seq1.length > 0 ? t1.right : "–"}
											</span>
										</div>
									</div>
									<div className="result-sequence">
										<p className="result-sequence__label">Sequence 2</p>
										<div className="result-sequence__row">
											<span className="result-sequence__dial-name">
												Amplitude
											</span>
											<span className="result-sequence__value">
												{data.seq2.length > 0 ? t2.left : "–"}
											</span>
										</div>
										<div className="result-sequence__row">
											<span className="result-sequence__dial-name">
												Frequency
											</span>
											<span className="result-sequence__value">
												{data.seq2.length > 0 ? t2.right : "–"}
											</span>
										</div>
									</div>
								</div>
								<p className="wunderbarrage-result__flip-note">
									Started recording late? You may have captured Sequence 2 first
									— if your values don't work, flip the sequences when entering
									them into the dials.
								</p>
							</div>
						)}
					</div>
				);
			}}
		</BaseSection>
	);
}

export default WunderbarageSection;
