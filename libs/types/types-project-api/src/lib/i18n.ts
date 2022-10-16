// All the supported languages
export type Locales = "fr" | "en";

// Type for all the objects that change depending on language
export type II18nObj<T> = {
	[key in Locales]: T;
};

// Type for text that can be translated in multiple languages
export type II18nText = II18nObj<String>;