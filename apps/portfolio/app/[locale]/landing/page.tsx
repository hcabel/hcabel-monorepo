import Link from "next/link";
import i18nText from "Utils/i18Text";
import { ILocaleLayoutProps } from "../layout";

import Style from "./page.module.scss";
import ArrowIcon from 'Images/arrow.svg';

export default function LandingPage(props: ILocaleLayoutProps)
{
	return (
		<div className={`Page ${Style.Landing}`}>
			<div className={Style.Description}>
				<h1 className={`h1 ${Style.Name}`} data-cy="my-real-name">Hugo Cabel</h1>
				<h3 className={`h4 ${Style.Job}`} data-cy="my-job">{i18nText("MyJob", props.params.locale)}</h3>
			</div>
			<Link className={Style.Freelance} href={`/${props.params.locale}/freelance`}>
				<h5 className={`h5 ${Style.FreelanceText}`}>{"Freelance"}</h5>
			</Link>
			<div className={Style.MyProject}>
				<ArrowIcon />
				<h5 className={`h5 ${Style.MyProjectText}`}>{i18nText("MyProjects-Title", props.params.locale)}</h5>
				<ArrowIcon />
			</div>
		</div>
	)
}