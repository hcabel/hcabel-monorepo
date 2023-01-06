"use client";

import Link from "next/link";

import Style from "./LocaleSelector.module.scss";

import TranslateIcon from 'Images/TranslateIcon.svg';
import Selector from "Components/Selector/Selector";
import { Locales } from "./layout";
import { usePathname } from 'next/navigation';

interface ILocaleSelectorProps {
	locale: Locales;
}

export default function LocaleSelector(props: ILocaleSelectorProps)
{
	const pathname = usePathname();
	const validLocales = ["fr", "en"];
	const currentLocale = props.locale;

	return (
		<Selector
			className={Style.LocaleSelector}
			renderSelected={(selected) => (
				<div data-cy='language-selector'className={`${Style.LocalLink} ${Style.LocalSelected}`}>
					<TranslateIcon />
					<span>
						{new Intl.DisplayNames(currentLocale, { type: 'language' }).of(currentLocale)}
					</span>
				</div>
			)}
		>
			{ // Create a list of all the valid locales without the current one
			validLocales.filter((lang) => lang !== currentLocale)
				// Then create all the entry for the selector
				.map((lang, index) => {
					const regionNamesInEnglish = new Intl.DisplayNames(lang, { type: 'language' });
					return (
						<span key={index} data-cy={`language-selector-option-${lang}`}>
							{/* When clicking on a entry, redirect to the same page but with the old locale replace with the new one */}
							<Link className={Style.LocalLink} href={pathname.replace(currentLocale, lang)}>
								{regionNamesInEnglish.of(lang)}
							</Link>
						</span>
					);
				})
			}
		</Selector>
	)
}