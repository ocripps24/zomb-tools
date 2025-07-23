import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material";

// Glassmorphism style helpers
const glassBackground = (color: string, opacity = 0.15, blur = 16) => ({
	background: alpha(color, opacity),
	backdropFilter: `blur(${blur}px)`,
	WebkitBackdropFilter: `blur(${blur}px)`,
});

const darkPalette = {
	mode: "dark" as const,
	primary: {
		main: "#00e0ff", // Neon cyan for accent
	},
	secondary: {
		main: "#ff3c6e", // Pink accent
	},
	background: {
		default: "#0a0a0a", // Black background
		paper: "#181a1b", // Slightly lighter for cards
	},
	text: {
		primary: "#f3f6f9",
		secondary: "#b0b8c1",
	},
};

const theme = createTheme({
	palette: darkPalette,
	shape: {
		borderRadius: 18,
	},
	components: {
		MuiPaper: {
			styleOverrides: {
				root: {
					...glassBackground("#181a1b", 0.18, 18),
					boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
					border: "1px solid rgba(255,255,255,0.08)",
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					...glassBackground("#181a1b", 0.22, 18),
					boxShadow: "0 4px 24px 0 rgba(31, 38, 135, 0.25)",
					borderBottom: "1px solid rgba(255,255,255,0.10)",
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					...glassBackground("#181a1b", 0.18, 18),
					boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
					border: "1px solid rgba(255,255,255,0.08)",
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 12,
					fontWeight: 600,
					textTransform: "none",
				},
			},
		},
	},
	typography: {
		fontFamily: "Inter, Roboto, Arial, sans-serif",
		h1: { fontWeight: 800 },
		h2: { fontWeight: 700 },
		h3: { fontWeight: 700 },
		h4: { fontWeight: 700 },
		h5: { fontWeight: 700 },
		h6: { fontWeight: 700 },
		button: { fontWeight: 700 },
	},
});

export default theme;
