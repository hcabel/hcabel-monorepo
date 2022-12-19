
import i18nDict from '../Assets/i18nDict.json'

export default function i18nText(dictKey: string, locale: string) {
	return (i18nDict as any)[dictKey][locale];
};