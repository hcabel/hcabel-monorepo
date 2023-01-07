'use client';

// Hooks
import { useLocale } from "App/[locale]/LocaleContext";
import { GetI18nDictValue, I18nDictValue } from "Utils/i18nDict";

interface II18nDictTextProps {
	i18nKey: string;
}

/**
 * This component will render the translated text based on the current locale from a i18n text object.
 * The text is fetch from the i18nDict.json file using the key provided.
 * @param i18nKey, the key to fetch the text from the i18nDict.json file
 */
export function I18nDictText(props: II18nDictTextProps)
{
	const { locale } = useLocale();

	return (
		<>
			{GetI18nDictValue(props.i18nKey, locale)}
		</>
	)
}


interface II18nTextProps {
	i18nText: I18nDictValue;
}

/**
 * This component will render the translated text based on the current locale from a i18n text object
 * @param i18nText, an object with all the locales as keys and the translated text as value
 */
export function I18nText(props: II18nTextProps)
{
	const { locale } = useLocale();

	return (
		<>
			{props.i18nText[locale]}
		</>
	)
}