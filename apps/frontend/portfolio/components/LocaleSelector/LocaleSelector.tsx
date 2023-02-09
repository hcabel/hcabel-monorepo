"use client";

import Link from "next/link";

import Style from "./LocaleSelector.module.scss";

import TranslateIcon from "Images/TranslateIcon.svg";
import Selector from "Components/Selector/Selector";
import { usePathname } from "next/navigation";
import { useLocale } from "App/[locale]/LocaleContext";

export default function LocaleSelector() {
	const { locale, locales } = useLocale();
	const pathname = usePathname();

	return (
		<Selector
			className={Style.LocaleSelector}
			renderSelected={(selected) => (
				<div
					data-cy="language-selector"
					className={`${Style.LocalLink} ${Style.LocalSelected}`}
				>
					<TranslateIcon />
					<span>
						{new Intl.DisplayNames(locale, { type: "language" }).of(
							locale
						)}
					</span>
				</div>
			)}
		>
			{
				// Create a list of all the valid locales without the current one
				locales
					.filter((lang) => lang !== locale)
					// Then create all the entry for the selector
					.map((lang, index) => {
						const regionNamesInEnglish = new Intl.DisplayNames(
							lang,
							{ type: "language" }
						);
						return (
							<span
								key={index}
								data-cy={`language-selector-option-${lang}`}
							>
								{/* When clicking on a entry, redirect to the same page but with the old locale replace with the new one */}
								<Link
									className={Style.LocalLink}
									href={pathname.replace(locale, lang)}
								>
									{regionNamesInEnglish.of(lang)}
								</Link>
							</span>
						);
					})
			}
		</Selector>
	);
}
