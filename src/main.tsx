import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/main.scss";
import { initTheme } from "./utils/theme.js";

// Suppress React Router v7 warnings
const router = {
	future: {
		v7_startTransition: true,
		v7_relativeSplatPath: true,
	},
};

// Handle GitHub Pages SPA redirect
const urlParams = new URLSearchParams(window.location.search);
const redirect = urlParams.get("redirect");
if (redirect) {
	// Remove the redirect parameter and navigate to the intended route
	window.history.replaceState({}, "", "/" + redirect);
}

// Initialize theme
initTheme();

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter {...router}>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
