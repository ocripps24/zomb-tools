// Theme management utility
export const THEMES = {
	DARK: "dark",
	LIGHT: "light",
};

export const STORAGE_KEY = "zomb-tools-theme";

export const getTheme = () => {
	return localStorage.getItem(STORAGE_KEY) || THEMES.DARK;
};

export const setTheme = (theme) => {
	localStorage.setItem(STORAGE_KEY, theme);
	applyTheme(theme);
};

export const applyTheme = (theme) => {
	const root = document.documentElement;

	if (theme === THEMES.LIGHT) {
		root.setAttribute("data-theme", "light");
	} else {
		root.removeAttribute("data-theme");
	}
};

export const toggleTheme = () => {
	const currentTheme = getTheme();
	const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
	setTheme(newTheme);
	return newTheme;
};

export const initTheme = () => {
	const savedTheme = getTheme();
	applyTheme(savedTheme);
	return savedTheme;
};
