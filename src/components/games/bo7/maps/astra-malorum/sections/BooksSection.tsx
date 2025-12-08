import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";
import { ResultsDisplay } from "@/components/ui";
import { useSectionSettings } from "@/hooks/useSectionSettings";

interface BooksData {
	selectedBooks: string[];
}

// Shelf sets with their books
const SHELF_SETS = [
	{
		id: 1,
		location: "Inner",
		books: [
			{ id: "musica-universalis", title: "Musica Universalis" },
			{ id: "the-black-veil", title: "The Black Veil" },
			{ id: "moon-directive", title: "Moon Directive" },
		],
	},
	{
		id: 2,
		location: "Outer",
		books: [
			{ id: "the-unknowable-void", title: "The Unknowable Void" },
			{ id: "echos-of-andromeda", title: "Echos of Andromeda" },
			{ id: "ashes-and-bones", title: "Ash and Bone" },
		],
	},
	{
		id: 3,
		location: "Corner",
		books: [
			{ id: "cydonia", title: "Cydonia" },
			{ id: "singularity", title: "Singularity" },
			{ id: "witchlight-codex", title: "Witchlight Codex" },
		],
	},
] as const;

function BooksSection(props: BaseSectionProps<BooksData>) {
	// Register this section's settings (none besides global uiSize for now)
	// Settings are managed by the global floating widget
	useSectionSettings({
		mapId: "astra-malorum",
		sectionId: "books",
		sectionName: "Books",
		settings: [], // No custom settings for this section
	});

	return (
		<BaseSection
			config={{
				storageKey: "astra-malorum-books-data",
				defaultValue: { selectedBooks: [] },
				title: "Books",
				description:
					"Check the machine in the Teleporter room for the reading list, then select the books you need to find in the library.",
				resetButtonText: "Clear Selection",
				tipsConfig: {
					show: true,
					items: [
						{
							label: "Step 1",
							text: "Go to the machine in the Teleporter room to get the reading list",
						},
						{
							label: "Step 2",
							text: "Find the books in the library on the three shelf sets",
						},
						{
							label: "Step 3",
							text: "Interact with each statue head the number of times equal to the books from that shelf",
						},
						{
							label: "Example",
							text: "If 2 books are from Inner shelf, interact with Inner statue twice",
						},
						{
							label: "Location",
							text: "Teleporter room (machine) and adjacent library (shelves)",
						},
					],
				},
			}}
			getProgress={(data: BooksData) => {
				const completed = data.selectedBooks.length;
				// Assuming users need to select books (could be anywhere from 1-9)
				// We'll mark as complete when at least 1 book is selected
				return {
					completed,
					total: 9,
					isComplete: completed > 0,
				};
			}}
			{...props}
		>
			{({ data, setData }) => {
				const handleBookClick = (bookId: string) => {
					const isSelected = data.selectedBooks.includes(bookId);

					if (isSelected) {
						// Deselect book
						setData({
							selectedBooks: data.selectedBooks.filter((id) => id !== bookId),
						});
					} else {
						// Select book
						setData({
							selectedBooks: [...data.selectedBooks, bookId],
						});
					}
				};

				// Calculate results for each shelf
				const getShelfResults = () => {
					return SHELF_SETS.map((shelf) => {
						const booksFromThisShelf = shelf.books.filter((book) =>
							data.selectedBooks.includes(book.id)
						).length;

						return {
							shelfId: shelf.id,
							location: shelf.location,
							count: booksFromThisShelf,
						};
					}).filter((result) => result.count > 0); // Only show shelves with selected books
				};

				const shelfResults = getShelfResults();
				const hasSelection = data.selectedBooks.length > 0;
				const resultStateClass = hasSelection
					? "books-section__result--success"
					: "";

				return (
					<div className="books-section">
						<div className="shelf-sets">
							{SHELF_SETS.map((shelf) => (
								<div key={shelf.id} className="shelf-set">
									<div className="shelf-set__header">
										<h4>{shelf.location} Shelf</h4>
									</div>
									<div className="shelf-set__books">
										{shelf.books.map((book) => {
											const isSelected = data.selectedBooks.includes(book.id);

											return (
												<button
													key={book.id}
													className={`book-button ${
														isSelected ? "book-button--selected" : ""
													}`}
													onClick={() => handleBookClick(book.id)}
												>
													<span className="book-button__title">
														{book.title}
													</span>
													{isSelected && (
														<span className="book-button__checkmark">✓</span>
													)}
												</button>
											);
										})}
									</div>
								</div>
							))}
						</div>

						{/* Results Display */}
						{hasSelection && (
							<div className={`books-section__results ${resultStateClass}`}>
								<h4>Statue Interactions Required</h4>
								<ResultsDisplay
									variant="grid"
									results={shelfResults.map((result) => ({
										id: result.shelfId.toString(),
										label: result.location,
										value: `${result.count}`,
									}))}
								/>
								<p className="interaction-instruction">
									Interact with each statue head the number of times shown above
								</p>
							</div>
						)}
					</div>
				);
			}}
		</BaseSection>
	);
}

export default BooksSection;
