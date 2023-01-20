// design
import "../global.scss";

// Components
import CookiePopup from "Components/CookiePopup/CookiePopup";
import LocaleSelector from "Components/LocaleSelector/LocaleSelector";
import PathnameWatcher from "Components/telemetry/PathnameWatcher";

// Hooks
import { LocaleProvider, Locales } from "./LocaleContext";

export interface LocaleLayoutParams {
	locale: Locales;
}

export interface ILocaleLayoutProps {
	children: React.ReactNode;
	params: LocaleLayoutParams;
}

export default function LocaleLayout(props: ILocaleLayoutProps) {
	return (
		<html lang={props.params.locale}>
			<body className="root" style={{ background: "grey" }}>
				<PathnameWatcher />
				{/* Allow to access the local from every where easily */}
				<LocaleProvider value={props.params.locale}>
					<LocaleSelector />
					{props.children}
					<CookiePopup />
				</LocaleProvider>
			</body>
		</html>
	);
}
