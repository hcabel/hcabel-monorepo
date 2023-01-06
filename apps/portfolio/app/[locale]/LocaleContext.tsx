'use client';

import React from "react";

export type Locales = "en" | "fr";
const Locales: Locales[] = ["fr", "en"];

interface ILocaleContext {
	locale: Locales;
	locales: Locales[];
}

const LocaleContext = React.createContext<ILocaleContext>({
	locale: "en",
	locales: Locales
});

interface ILocaleContextProps {
	children: React.ReactNode;
	value: Locales;
}

export function LocaleProvider({ children, value }: ILocaleContextProps)
{
	return (
		<LocaleContext.Provider value={{
			locale: value,
			locales: Locales
		}}>
			{children}
		</LocaleContext.Provider>
	);
}

export function useLocale()
{
	const context = React.useContext(LocaleContext);
	if (!context) {
	  throw new Error('useLocale must be used within a LocaleProvider');
	}
	return (context);
}