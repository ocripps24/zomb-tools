import React from "react";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { ResultsDisplay } from "@/components/ui";

// Document data with predefined order for code calculation
const DOCUMENTS = [
	{
		id: 1,
		name: "Notso's Collar",
		number: 1,
		date: "07/15/1985",
		dateObj: new Date(1985, 6, 15), // Month is 0-indexed in JavaScript
	},
	{
		id: 2,
		name: "Katana",
		number: 2,
		date: "12/08/1985",
		dateObj: new Date(1985, 11, 8),
	},
	{
		id: 3,
		name: "Scarf",
		number: 3,
		date: "08/21/1985",
		dateObj: new Date(1985, 7, 21),
	},
	{
		id: 4,
		name: "Wristwatch",
		number: 4,
		date: "09/02/1985",
		dateObj: new Date(1985, 8, 2),
	},
	{
		id: 5,
		name: "Combat Goggles",
		number: 5,
		date: "10/12/1985",
		dateObj: new Date(1985, 9, 12),
	},
	{
		id: 6,
		name: "BND Badge",
		number: 6,
		date: "6/28/1985",
		dateObj: new Date(1985, 5, 28),
	},
];

// Pre-calculated order based on dates (earliest to latest): 6, 1, 3, 4, 5, 2
const DATE_ORDER = [6, 1, 3, 4, 5, 2];

// Data interface for this section
interface DocumentsData {
	selectedDocuments: number[];
}

function DocumentsCodeSection(props: BaseSectionProps<DocumentsData>) {
	return (
		<BaseSection
			config={{
				storageKey: "reckoning-documents-data",
				defaultValue: { selectedDocuments: [] },
				title: "Documents Code",
				description: "Select the 4 documents that are present in your game.",
				resetButtonText: "Reset Documents"
			}}
			getProgress={(data: DocumentsData) => {
				const selectedCount = data.selectedDocuments?.length || 0;
				return {
					completed: selectedCount,
					total: 4,
					isComplete: selectedCount === 4
				};
			}}
			{...props}
		>
			{({ data, setData, progress }) => {
				const handleDocumentToggle = (documentId: number) => {
					setData((prev: DocumentsData) => {
						const currentSelected = prev.selectedDocuments || [];
						const isSelected = currentSelected.includes(documentId);

						let newSelected: number[];
						if (isSelected) {
							// Remove document
							newSelected = currentSelected.filter((id) => id !== documentId);
						} else {
							// Add document (max 4)
							if (currentSelected.length < 4) {
								newSelected = [...currentSelected, documentId];
							} else {
								// Already at max, don't add
								return prev;
							}
						}

						return {
							...prev,
							selectedDocuments: newSelected,
						};
					});
				};

				const generateCode = () => {
					const selectedDocs = data.selectedDocuments || [];
					if (selectedDocs.length === 0) return "";

					// Sort selected documents by their position in the date order
					const sortedSelected = selectedDocs.sort((a, b) => {
						const orderA = DATE_ORDER.indexOf(a);
						const orderB = DATE_ORDER.indexOf(b);
						return orderA - orderB;
					});

					// Get the numbers of the sorted documents
					return sortedSelected
						.map((docId) => DOCUMENTS.find((doc) => doc.id === docId)?.number)
						.join("");
				};

				const selectedCount = data.selectedDocuments?.length || 0;
				const generatedCode = generateCode();

				return (
					<div className="documents-section">
						{/* Document Selection Grid */}
						<div className="documents-grid">
							{DOCUMENTS.map((document) => {
								const isSelected = data.selectedDocuments?.includes(document.id);
								const isDisabled = !isSelected && selectedCount >= 4;

								return (
									<div
										key={document.id}
										className={`document-card ${
											isSelected ? "document-card--selected" : ""
										} ${isDisabled ? "document-card--disabled" : ""}`}
										onClick={() => !isDisabled && handleDocumentToggle(document.id)}
									>
										<div className="document-number">#{document.number}</div>
										<div className="document-info">
											<h4 className="document-name">{document.name}</h4>
											<p className="document-date">{document.date}</p>
										</div>
										<div className="document-status">{isSelected ? "✓" : "+"}</div>
									</div>
								);
							})}
						</div>

						{/* Code Preview */}
						<ResultsDisplay
							variant="single-code"
							title="Generated Code"
							finalCode={selectedCount === 4 ? generatedCode : ""}
							codeFormat="standard"
							codeNote={
								selectedCount === 4
									? `Enter this ${generatedCode.length}-digit code into the computer terminal in the teleportation room.`
									: `Select ${4 - selectedCount} more document${4 - selectedCount !== 1 ? "s" : ""} to complete the code`
							}
							progressMode="replace"
							progress={{
								completed: selectedCount,
								total: 4,
							}}
							colorScheme="success"
						/>
					</div>
				);
			}}
		</BaseSection>
	);
}

export default DocumentsCodeSection;