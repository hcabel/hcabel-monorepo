
import CookiePopup from 'Components/CookiePopup/CookiePopup';
import './global.scss';

import Head from "./head";

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children, }: RootLayoutProps) {
	return (
		<html>
			<Head />
			<body className="root">
				{children}
				<CookiePopup />
			</body>
		</html>
	);
}
