import { CodeCollectionSection } from "@/components/content";

// Define the three locations and their value ranges
const CODE_LOCATIONS = [
	{
		id: "liberty-lanes",
		name: "Liberty Lanes",
		description: "Number found underneath some beer bottles",
		min: 0,
		max: 59,
	},
	{
		id: "bank-counter",
		name: "Bank Counter",
		description: "Number found on the right hand side of the counter",
		min: 0,
		max: 59,
	},
	{
		id: "ollys-comic",
		name: "Olly's Comic Shop",
		description: "Number found by crouching in the centre set of cabinets",
		min: 0,
		max: 59,
	},
];

const TIPS_CONFIG = {
	show: true,
	items: [
		{
			label: "Liberty Lanes",
			text: "The 1st number is found underneath some beer bottles at the bowling alley",
		},
		{
			label: "Bank Counter",
			text: "The 2nd number is located on the right hand side of the counter inside the bank",
		},
		{
			label: "Olly's Comic Shop",
			text: "The 3rd number can be found by crouching in the centre set of cabinets in the back shop",
		},
		{
			label: "Order",
			text: "Enter the numbers in the vault in the order: Liberty Lanes - Bank Counter - Olly's Comic Shop",
		},
	],
};

function VaultCodeSection({
	data,
	onChange,
	onNext,
	onPrevious,
	currentStep,
	totalSteps,
}) {
	return (
		<CodeCollectionSection
			title="Vault Code"
			description="Collect three numbers from different locations around Liberty Falls to open the vault."
			locations={CODE_LOCATIONS}
			storageKey="liberty-falls-vault-data"
			data={data}
			onChange={onChange}
			codeFormat="spaced"
			className="safe-code-section"
			resetButtonText="Reset Vault Code"
			finalCodeNote="Enter these numbers into the vault: 1st - 2nd - 3rd"
			tipsConfig={TIPS_CONFIG}
			onNext={onNext}
			onPrevious={onPrevious}
			currentStep={currentStep}
			totalSteps={totalSteps}
		/>
	);
}

export default VaultCodeSection;
