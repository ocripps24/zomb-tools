import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";

interface NavBarProps {
	title?: string;
}

const NavBar: React.FC<NavBarProps> = ({ title }) => {
	const navigate = useNavigate();

	return (
		<AppBar position="static" color="transparent" elevation={0} sx={{ mb: 3 }}>
			<Toolbar>
				<IconButton
					edge="start"
					color="inherit"
					aria-label="home"
					onClick={() => navigate("/")}
					sx={{ mr: 2 }}
				>
					<HomeIcon />
				</IconButton>
				<IconButton
					color="inherit"
					aria-label="games"
					onClick={() => navigate("/")}
				>
					<SportsEsportsIcon />
				</IconButton>
				<IconButton
					color="inherit"
					aria-label="maps"
					onClick={() => navigate("/bo4")}
				>
					<MapIcon />
				</IconButton>
				<IconButton
					color="inherit"
					aria-label="settings"
					onClick={() => navigate("/settings")}
					sx={{ ml: "auto" }}
				>
					<SettingsIcon />
				</IconButton>
				{title && (
					<Typography variant="h6" sx={{ ml: 2, flexGrow: 1, fontWeight: 700 }}>
						{title}
					</Typography>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default NavBar;
