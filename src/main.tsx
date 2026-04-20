import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ConsentProvider } from "./contexts/ConsentContext";
import { SettingsRegistryProvider } from "./contexts/SettingsRegistryContext";
import "./styles/main.scss";

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
	window.history.replaceState({}, "", "/" + redirect);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter {...router}>
			<ConsentProvider>
				<SettingsRegistryProvider>
					<App />
				</SettingsRegistryProvider>
			</ConsentProvider>
		</BrowserRouter>
	</React.StrictMode>
);
