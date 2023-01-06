import CookiePopup from 'Components/CookiePopup/CookiePopup';
import '../global.scss';

import Head from "./head";
import LocaleSelector from './LocaleSelector';

export type Locales = "en" | "fr";

export interface LocaleLayoutParams {
	locale: Locales;
}

export interface ILocaleLayoutProps {
	children: React.ReactNode;
	params: LocaleLayoutParams;
}

export default function LocaleLayout(props: ILocaleLayoutProps)
{
	return (
		<html lang={props.params.locale}>
			<Head
				title={"Hugo Cabel"}
				desc={"																						\
					Welcome to my portfolio!																\
					I am a passionate software engineer that love very diverse fields of computer science.	\
					On this website, you can browse through my latest projects,								\
					including 																				\
						'HugoMeet' (using JavaScript, WebRTC, and React),									\
						a terrain procedural generation project created with Unreal Engine 4 and C++,		\
						and much more.																		\
					Take a look and get in touch if you'd like to work together on your next project!		\
				"}
			/>
			<body className="root" style={{ background: "grey" }}>
				<LocaleSelector locale={props.params.locale} />
				{props.children}
				<CookiePopup />
			</body>
		</html>
	);
}
