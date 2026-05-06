import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import tr from "./locales/tr.json";

const savedLocale = localStorage.getItem("locale-storage");
const defaultLocale = savedLocale
	? (JSON.parse(savedLocale).state.locale as string)
	: import.meta.env.VITE_DEFAULT_LOCALE || "tr";

i18n.use(initReactI18next).init({
	resources: {
		tr: { translation: tr },
		en: { translation: en },
	},
	lng: defaultLocale,
	fallbackLng: "tr",
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
