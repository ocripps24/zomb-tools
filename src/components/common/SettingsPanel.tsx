import React from "react";
import Drawer from "@mui/material/Drawer";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface SettingsPanelProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
	open,
	onClose,
	children,
}) => {
	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: {
					width: { xs: "90vw", sm: 400 },
					background: "rgba(24,26,27,0.18)",
					backdropFilter: "blur(18px)",
					borderLeft: "1px solid rgba(255,255,255,0.10)",
				},
			}}
		>
			<Paper
				elevation={0}
				sx={{
					p: 3,
					minHeight: "100vh",
					boxShadow: "none",
					background: "transparent",
				}}
			>
				<IconButton
					onClick={onClose}
					sx={{ position: "absolute", top: 8, right: 8 }}
				>
					<CloseIcon />
				</IconButton>
				{children}
			</Paper>
		</Drawer>
	);
};

export default SettingsPanel;
