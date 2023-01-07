import Link from "next/link";
import { ILocaleLayoutProps } from "../layout";

import Style from "./page.module.scss";
import ArrowIcon from 'Images/arrow.svg';
import { I18nDictText } from "Components/i18nText";

export default function LandingPage(props: ILocaleLayoutProps)
{
	return (
		<div className={`Page ${Style.Landing}`}>
			<div className={Style.Description}>
				<h1 className={`h1 ${Style.Name}`} data-cy="my-real-name">Hugo Cabel</h1>
				<h2 className={`h4 ${Style.Job}`} data-cy="my-job">
					<I18nDictText i18nKey="MyJob" />
				</h2>
			</div>
			<Link className={Style.Freelance} href={`/${props.params.locale}/freelance`}>
				<h3 className={`h5 ${Style.FreelanceText}`}>{"Freelance"}</h3>
			</Link>
			<div className={Style.MyProject}>
				<ArrowIcon />
				<h4 className={`h4 ${Style.MyProjectText}`}>
					<I18nDictText i18nKey="MyProjects-Title" />
				</h4>
				<ArrowIcon />
			</div>
		</div>
	)
}

// Tell nextjs to pre-render the pages where the dynamic params [locale] is "en" and "fr"
export async function generateStaticParams()
{
	return ([
		{ locale: "en" },
		{ locale: "fr" }
	]);
}
